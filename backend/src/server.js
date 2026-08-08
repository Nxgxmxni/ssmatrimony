const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

// Initialize Express App
const app = express();

// Connect to MongoDB Database
connectDB();

// Security Headers Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Unsplash / external CDN images in dev/prod
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api', apiRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SS Matrimony API Server',
    documentation: '/api/health',
    status: 'Running',
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Endpoint Not Found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Server Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(` 💍 SS Matrimony Backend Server running on port ${PORT}`);
  console.log(` 🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` 🚀 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================\n`);
});
