require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// ==================== MIDDLEWARE ====================
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true }));

// ==================== DATABASE ====================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// ==================== ROUTES ====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/bloodbank', require('./routes/bloodbank'));
app.use('/api/reports', require('./routes/reports'));

// ==================== ROOT ROUTE ====================
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BBMS Backend API',
    version: '1.0.0',
    status: 'Server is running',
    endpoints: {
      auth: '/api/auth',
      donors: '/api/donors',
      inventory: '/api/inventory',
      requests: '/api/requests',
      bloodbank: '/api/bloodbank',
      reports: '/api/reports',
    },
  });
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API: http://localhost:${PORT}/api\n`);
});

module.exports = app;
