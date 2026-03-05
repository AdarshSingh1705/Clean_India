const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    // Store in memory (use Redis in production for multiple servers)
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const rateLimiters = {
  // General API rate limit
  general: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests
    'Too many requests from this IP, please try again later'
  ),
  
  // Strict rate limit for authentication
  auth: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts
    'Too many login attempts, please try again after 15 minutes'
  ),
  
  // Rate limit for issue creation
  createIssue: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    10, // 10 issues
    'Too many issues created, please try again later'
  ),
  
  // Rate limit for comments
  createComment: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    30, // 30 comments
    'Too many comments, please slow down'
  )
};

// Security headers using Helmet
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS from request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove script tags and dangerous characters
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
    });
  }
  next();
};

// SQL injection prevention (parameterized queries enforcer)
const preventSQLInjection = (req, res, next) => {
  // Log warning if raw SQL detected in params
  const checkForSQL = (value) => {
    if (typeof value === 'string') {
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
        /(--|;|\/\*|\*\/)/,
        /('|")\s*(OR|AND)\s*('|")/i
      ];
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    return false;
  };

  // Check query params
  if (req.query) {
    Object.values(req.query).forEach(value => {
      if (checkForSQL(value)) {
        console.warn('⚠️  Potential SQL injection attempt detected:', value);
      }
    });
  }

  // Check body params
  if (req.body) {
    Object.values(req.body).forEach(value => {
      if (checkForSQL(value)) {
        console.warn('⚠️  Potential SQL injection attempt detected:', value);
      }
    });
  }

  next();
};

// Request logging for security audit
const securityLogger = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.user?.id || 'anonymous'
  };

  // Log suspicious activity
  if (req.path.includes('..') || req.path.includes('etc/passwd')) {
    console.warn('🚨 Suspicious request detected:', logData);
  }

  next();
};

module.exports = {
  rateLimiters,
  securityHeaders,
  sanitizeInput,
  preventSQLInjection,
  securityLogger
};
