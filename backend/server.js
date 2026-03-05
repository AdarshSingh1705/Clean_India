const express = require('express');
const cors = require('cors');
const tf = require('@tensorflow/tfjs');
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const compression = require('compression');
const fs = require('fs');
const errorHandler = require('./middleware/errorHandler');
const NotificationService = require('./services/NotificationService');
const EmailService = require('./services/EmailService');

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  const prodEnvPath = path.join(__dirname, '.env.production');
  if (fs.existsSync(prodEnvPath)) {
    require('dotenv').config({ path: prodEnvPath });
  }
} else {
  require('dotenv').config();
}

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.IO configuration
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://clean-india-frontend.onrender.com',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  path: '/socket.io/'
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next();
  }
  next();
});

// Security & Performance Middleware
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://clean-india-frontend.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Static file serving
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));
app.use('/model', express.static(path.join(__dirname, 'model')));

// ML Model Loading
let wasteModel;
const loadModel = async () => {
  try {
    const modelDir = path.join(__dirname, 'model');
    const modelJsonPath = path.join(modelDir, 'model.json');
    
    if (!fs.existsSync(modelJsonPath)) {
      console.warn('⚠️  ML model not found. Classification endpoint will be unavailable.');
      return;
    }
    
    const modelJson = JSON.parse(fs.readFileSync(modelJsonPath, 'utf8'));
    const weightSpecs = modelJson.weightsManifest[0].paths;
    const weightBuffers = [];
    
    for (const weightFile of weightSpecs) {
      const weightPath = path.join(modelDir, weightFile);
      const buffer = fs.readFileSync(weightPath);
      weightBuffers.push(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    }
    
    const totalLength = weightBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const allWeights = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of weightBuffers) {
      allWeights.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }
    
    const modelArtifacts = {
      modelTopology: modelJson.modelTopology,
      weightSpecs: modelJson.weightsManifest[0].weights,
      weightData: allWeights.buffer,
      format: modelJson.format,
      generatedBy: modelJson.generatedBy,
      convertedBy: modelJson.convertedBy
    };
    
    wasteModel = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts));
    app.set('wasteModel', wasteModel);
    console.log('✅ Waste classifier model loaded successfully');
  } catch (err) {
    console.error('❌ Failed to load waste model:', err.message);
  }
};

// Socket.IO event handlers
io.on('connection', (socket) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('User connected:', socket.id);
  }
  
  socket.on('join-issue-room', (issueId) => {
    socket.join(`issue-${issueId}`);
  });
  
  socket.on('leave-issue-room', (issueId) => {
    socket.leave(`issue-${issueId}`);
  });
  
  socket.on('disconnect', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('User disconnected:', socket.id);
    }
  });
});

// Make services available to routes
app.set('io', io);
app.locals.NotificationService = NotificationService;
app.locals.notifications = NotificationService;

// Route Loading
const routes = [
  { path: '/api/auth', file: './routes/auth', name: 'auth' },
  { path: '/api/users', file: './routes/users', name: 'users' },
  { path: '/api/issues', file: './routes/issues', name: 'issues' },
  { path: '/api/comments', file: './routes/comments', name: 'comments' },
  { path: '/api/likes', file: './routes/likes', name: 'likes' },
  { path: '/api/admin', file: './routes/admin', name: 'admin' },
  { path: '/api/notifications', file: './routes/notifications', name: 'notifications' },
  { path: '/api/stats', file: './routes/stats', name: 'stats' }
];

routes.forEach(({ path: routePath, file, name }) => {
  try {
    const route = require(file);
    app.use(routePath, route);
  } catch (err) {
    console.error(`Failed to load ${name} routes:`, err.message);
  }
});

// Multer configuration
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Waste classifier endpoint
app.post('/api/classify', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    if (!wasteModel) {
      return res.status(503).json({ 
        error: 'ML model not loaded yet. Please try again in a moment.' 
      });
    }

    const resized = await sharp(req.file.buffer)
      .resize(256, 256)
      .raw()
      .toBuffer();

    const tensor = tf.tensor3d(resized, [256, 256, 3])
      .expandDims(0)
      .div(255.0);

    const prediction = wasteModel.predict(tensor);
    const prob = prediction.dataSync()[0];
    const waste = prob >= 0.5;

    tensor.dispose();
    prediction.dispose();

    res.json({ probability: prob, waste });
  } catch (err) {
    console.error('Classification Error:', err);
    res.status(500).json({ 
      error: 'Failed to classify image', 
      details: process.env.NODE_ENV === 'production' ? undefined : err.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Received shutdown signal. Closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Start server
const startServer = async () => {
  try {
    await loadModel();
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
