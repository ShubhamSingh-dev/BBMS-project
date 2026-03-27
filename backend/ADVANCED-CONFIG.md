# BBMS Backend - Advanced Configuration & Best Practices

## Table of Contents
1. [Environment Configuration](#environment-configuration)
2. [Database Optimization](#database-optimization)
3. [Security Hardening](#security-hardening)
4. [Performance Optimization](#performance-optimization)
5. [Logging & Monitoring](#logging--monitoring)
6. [Error Handling Best Practices](#error-handling-best-practices)
7. [Testing Guide](#testing-guide)
8. [Caching Strategy](#caching-strategy)
9. [Rate Limiting](#rate-limiting)
10. [Deployment Best Practices](#deployment-best-practices)

---

## Environment Configuration

### Development vs Production Settings

#### Development (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bbms
JWT_SECRET=dev_secret_key_change_in_production
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
DATABASE_POOL_SIZE=5
```

#### Production (.env.production)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bbms
JWT_SECRET=your_very_long_random_secret_key_minimum_32_chars
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=error
DATABASE_POOL_SIZE=20
JWT_EXPIRY=7d
API_RATE_LIMIT=100
```

#### Staging (.env.staging)
```
PORT=5000
NODE_ENV=staging
MONGODB_URI=mongodb://staging-server/bbms
JWT_SECRET=staging_secret_key
CORS_ORIGIN=https://staging.yourdomain.com
LOG_LEVEL=info
DATABASE_POOL_SIZE=10
```

---

## Database Optimization

### 1. Index Strategy

Add these indexes for better performance:

```javascript
// In each model file, add after schema definition:

// User Model
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Donor Model
donorSchema.index({ userId: 1 });
donorSchema.index({ bloodType: 1, status: 1 });
donorSchema.index({ 'location.city': 1 });
donorSchema.index({ status: 1 });

// BloodInventory Model
bloodInventorySchema.index({ bloodType: 1, status: 1 });
bloodInventorySchema.index({ expiryDate: 1 });
bloodInventorySchema.index({ status: 1 });
bloodInventorySchema.index({ donorId: 1 });

// BloodRequest Model
bloodRequestSchema.index({ status: 1 });
bloodRequestSchema.index({ bloodType: 1 });
bloodRequestSchema.index({ requiredByDate: 1 });
bloodRequestSchema.index({ urgency: 1 });
bloodRequestSchema.index({ requesterId: 1 });
```

### 2. Query Optimization

```javascript
// ❌ SLOW - Gets all fields
const donors = await Donor.find();

// ✅ FAST - Select only needed fields
const donors = await Donor.find().select('bloodType status donationHistory').limit(20);

// ✅ FASTER - Use lean() for read-only queries
const donors = await Donor.find().lean().select('bloodType status').limit(20);

// ✅ BEST - Combine with pagination
const page = req.query.page || 1;
const limit = 20;
const skip = (page - 1) * limit;
const donors = await Donor.find()
  .select('bloodType status donationHistory')
  .skip(skip)
  .limit(limit)
  .lean();
```

### 3. Connection Pooling

Update server.js:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: parseInt(process.env.DATABASE_POOL_SIZE) || 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};
```

---

## Security Hardening

### 1. Environment Variable Security

```javascript
// config.js
const requiredEnvVars = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'NODE_ENV',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};
```

### 2. Enhanced CORS Configuration

```javascript
// server.js
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://yourdomain.com',
  'https://www.yourdomain.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

### 3. Rate Limiting

```javascript
// npm install express-rate-limit

const rateLimit = require('express-rate-limit');

// General API limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later.',
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### 4. Request Validation

```javascript
// middleware/validator.js
const { body, validationResult, param } = require('express-validator');

const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty(),
  body('phone').isMobilePhone(),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  handleValidationErrors,
};
```

### 5. Input Sanitization

```javascript
// middleware/sanitize.js
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());
```

---

## Performance Optimization

### 1. Caching with Redis

```javascript
// npm install redis

const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Cache middleware
const cacheMiddleware = (duration = 10 * 60) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.originalUrl || req.url}`;
    client.get(key, (err, data) => {
      if (data) {
        res.json(JSON.parse(data));
      } else {
        res.originalJson = res.json;
        res.json = (body) => {
          client.setex(key, duration, JSON.stringify(body));
          res.originalJson(body);
        };
        next();
      }
    });
  };
};

// Usage in routes
app.get('/api/bloodbank/stats', cacheMiddleware(30 * 60), getBloodBankStats);
```

### 2. Pagination Helper

```javascript
// utils/pagination.js
const getPagination = (page = 1, limit = 20) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (validPage - 1) * validLimit;

  return { skip, limit: validLimit, page: validPage };
};

const getPaginationResponse = (data, total, page, limit) => {
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

module.exports = { getPagination, getPaginationResponse };
```

### 3. Response Compression

```javascript
// server.js
const compression = require('compression');

app.use(compression());
```

---

## Logging & Monitoring

### 1. Enhanced Logging

```javascript
// npm install winston

const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
```

### 2. Request Logging

```javascript
// middleware/requestLogger.js
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      user: req.user?.id || 'anonymous',
    });
  });

  next();
};

module.exports = requestLogger;
```

### 3. Error Monitoring

```javascript
// npm install sentry-node

const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Use Sentry middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## Error Handling Best Practices

### 1. Custom Error Class

```javascript
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

### 2. Centralized Error Handler

```javascript
// middleware/errorHandler.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    err.statusCode = 400;
    err.message = message;
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.message = `${field} already exists`;
    err.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token';
    err.statusCode = 401;
  }

  // Log error
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
```

---

## Testing Guide

### 1. Unit Tests with Jest

```bash
npm install --save-dev jest supertest
```

```javascript
// __tests__/auth.test.js
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Authentication', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: '9876543210',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should not register user with existing email', async () => {
      await User.create({
        name: 'Existing',
        email: 'test@example.com',
        password: 'hashed',
        phone: '1234567890',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: '9876543210',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '9876543210',
      });
    });

    it('should login user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });
  });
});
```

### 2. API Integration Tests

```javascript
// __tests__/donors.test.js
describe('Donor Endpoints', () => {
  let token;

  beforeEach(async () => {
    // Create and login user
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    token = res.body.token;
  });

  describe('POST /api/donors', () => {
    it('should create a donor profile', async () => {
      const res = await request(app)
        .post('/api/donors')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bloodType: 'O+',
          dateOfBirth: '1990-05-15',
          weight: 70,
          height: 180,
          gender: 'male',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.bloodType).toBe('O+');
    });
  });
});
```

---

## Caching Strategy

### 1. Cache Invalidation

```javascript
// utils/cache.js
class CacheManager {
  constructor(client) {
    this.client = client;
  }

  async set(key, value, duration = 3600) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, JSON.stringify(value), (err) => {
        if (err) reject(err);
        resolve(value);
      });
    });
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) reject(err);
        resolve(data ? JSON.parse(data) : null);
      });
    });
  }

  async invalidate(pattern) {
    return new Promise((resolve, reject) => {
      this.client.keys(pattern, (err, keys) => {
        if (err) reject(err);
        if (keys.length === 0) return resolve();
        this.client.del(...keys, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    });
  }
}
```

### 2. Cache Keys Strategy

```javascript
// Cache key naming convention
const cacheKeys = {
  DONORS: 'donors',
  DONOR_BY_ID: (id) => `donor:${id}`,
  INVENTORY: 'inventory',
  INVENTORY_BY_TYPE: (type) => `inventory:${type}`,
  REQUESTS: 'requests',
  BLOOD_BANK_STATS: 'bloodbank:stats',
  AVAILABLE_BLOOD: 'available:blood',
};

// Usage
// When creating inventory
await cacheManager.invalidate('inventory:*');
await cacheManager.invalidate('available:blood');

// When updating stats
await cacheManager.invalidate('bloodbank:*');
```

---

## Rate Limiting

### 1. Endpoint-Specific Limits

```javascript
const express = require('express');
const rateLimit = require('express-rate-limit');

// Different limits for different endpoints
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Allow 50 creates per hour
});

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Allow 300 reads per 15 minutes
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 auth attempts
  skipSuccessfulRequests: true,
});

// Apply to routes
router.post('/donors', protect, createLimiter, createDonor);
router.get('/donors', protect, readLimiter, getAllDonors);
router.post('/auth/login', authLimiter, login);
```

---

## Deployment Best Practices

### 1. Pre-Deployment Checklist

```
✅ Code Review
✅ All Tests Passing
✅ No Console.logs in Production Code
✅ Environment Variables Set
✅ Database Migrations Run
✅ SSL Certificate Installed
✅ Backup Strategy in Place
✅ Monitoring Set Up
✅ Error Tracking Enabled
✅ CDN Configured (if needed)
✅ Load Balancer Configured (if needed)
✅ Auto-scaling Rules Set
```

### 2. Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm ci --only=production

# Run migrations (if any)
npm run migrate

# Start server
npm start

echo "✅ Deployment complete!"
```

### 3. Health Check Endpoint

```javascript
// routes/health.js
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// For monitoring, check regularly
// curl http://localhost:5000/health
```

### 4. Graceful Shutdown

```javascript
// server.js
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 30000);
});
```

---

## Performance Monitoring

### 1. Response Time Tracking

```javascript
// middleware/performanceMonitoring.js
const performanceMonitoring = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    
    if (duration > 1000) { // Log slow requests
      logger.warn({
        message: 'Slow request detected',
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        status: res.statusCode,
      });
    }
  });

  next();
};

app.use(performanceMonitoring);
```

### 2. Database Query Monitoring

```javascript
// Enable Mongoose debug in development
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', (collection, method, query, doc) => {
    console.log(`MongoDB Query: ${collection}.${method}`, query);
  });
}
```

---

## Scalability Considerations

### 1. Microservices Preparation

```javascript
// Keep controllers focused and independent
// Each controller should handle one domain
// Can be extracted to separate services later:
// - authService
// - donorService
// - inventoryService
// - requestService
```

### 2. API Versioning

```javascript
// Routes versioning
app.use('/api/v1/auth', require('./routes/v1/auth'));
app.use('/api/v1/donors', require('./routes/v1/donors'));

// Future versions
app.use('/api/v2/auth', require('./routes/v2/auth'));
```

### 3. Load Balancing Ready

```javascript
// Use sticky sessions if needed
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  store: require('connect-mongo')({
    url: process.env.MONGODB_URI,
  }),
}));
```

---

## Summary of Advanced Features

✅ Environment-based configuration
✅ Database optimization with indexes
✅ Security hardening
✅ Rate limiting
✅ Caching strategy
✅ Comprehensive logging
✅ Error monitoring
✅ Unit & integration tests
✅ Performance optimization
✅ Graceful shutdown
✅ Health monitoring
✅ Scalability preparation

---

**All these features are recommendations for production deployment. Start with the basic setup, then add these as needed.**
