import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize self-contained database
connectDB();

const app = express();

// Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & API Directory endpoint
app.get(['/api', '/api/\\*'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to StayEase Backend REST API',
    note: req.originalUrl.includes('*')
      ? "The asterisk (*) represents any route under /api. Below are the available active endpoints."
      : "API is active and serving requests.",
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me'
      },
      hotels: {
        list: 'GET /api/hotels',
        details: 'GET /api/hotels/:id',
        create: 'POST /api/hotels (Admin)',
        update: 'PUT /api/hotels/:id (Admin)',
        delete: 'DELETE /api/hotels/:id (Admin)'
      },
      rooms: {
        list: 'GET /api/rooms',
        details: 'GET /api/rooms/:id',
        create: 'POST /api/rooms (Admin)',
        update: 'PUT /api/rooms/:id (Admin)',
        delete: 'DELETE /api/rooms/:id (Admin)'
      },
      bookings: {
        create: 'POST /api/bookings',
        myBookings: 'GET /api/bookings/my',
        details: 'GET /api/bookings/:id',
        cancel: 'PATCH /api/bookings/:id/cancel'
      },
      admin: {
        stats: 'GET /api/admin/stats',
        bookings: 'GET /api/admin/bookings',
        updateStatus: 'PATCH /api/admin/bookings/:id/status',
        users: 'GET /api/admin/users'
      }
    }
  });
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'StayEase Backend REST API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// In Production, serve compiled client frontend
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../client/dist');
  app.use(express.static(clientDist));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`StayEase Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API endpoints accessible at http://127.0.0.1:${PORT}/api`);
});

export default app;
