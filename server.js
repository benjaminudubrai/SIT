import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { Storage } from '@google-cloud/storage';
import 'dotenv/config';
import logger from './config/logger.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Morgan HTTP request logging
const stream = {
  write: (message) => logger.http(message.trim()),
};
app.use(morgan('tiny', { stream }));

// Google Cloud Storage setup (optional)
let storage, bucket;
if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_STORAGE_BUCKET) {
  storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Path to service account key
  });
  bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
  logger.info('Google Cloud Storage configured');
} else {
  logger.info('Google Cloud Storage not configured - file uploads will be stored locally');
}

if (!process.env.MONGODB_URI) {
  logger.error('MongoDB connection string is missing. Please set MONGODB_URI in your .env file.');
  process.exit(1);
}

// MongoDB connection
// useNewUrlParser and useUnifiedTopology are deprecated and no longer needed.
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', (error) => logger.error(`MongoDB connection error: ${error.message}`));
db.once('open', () => {
  logger.info('Connected to MongoDB');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  // Log the error internally, ensuring message and stack are captured.
  logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  logger.debug(err.stack);

  const message = err.message || 'Something went wrong!';

  res.status(statusCode).json({ 
    message, 
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  server.close(() => process.exit(1));
});

export default app;
