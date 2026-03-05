const { Pool } = require('pg');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ debug: false });
}

// Production-grade connection pool configuration
const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
  
  // SSL Configuration
  ssl: {
    require: true,
    rejectUnauthorized: false
  },
  
  // Connection Pool Settings (Production-grade)
  max: 20,                    // Maximum connections in pool
  min: 2,                     // Minimum connections to maintain
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Timeout for new connections
  
  // Query timeout
  statement_timeout: 30000,   // 30 second query timeout
  
  // Keep-alive settings
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  
  // Application name for monitoring
  application_name: 'clean-india-app'
};

// Create connection pool
const pool = new Pool(poolConfig);

// Connection event handlers
pool.on('connect', (client) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ New database connection established');
  }
});

pool.on('acquire', (client) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔗 Connection acquired from pool');
  }
});

pool.on('remove', (client) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔌 Connection removed from pool');
  }
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected database error:', err.message);
  console.error('Stack:', err.stack);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, closing database pool...');
  await pool.end();
  console.log('✅ Database pool closed');
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, closing database pool...');
  await pool.end();
  console.log('✅ Database pool closed');
  process.exit(0);
});

// Health check function
pool.healthCheck = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return { healthy: true, message: 'Database connection OK' };
  } catch (error) {
    return { healthy: false, message: error.message };
  }
};

// Get pool statistics
pool.getStats = () => {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount
  };
};

module.exports = pool;
