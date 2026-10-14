import express from 'express';
import {
  getAdminBookings,
  updateBookingStatus,
  getAdminStats,
  getAdminUsers
} from '../controllers/bookingController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce both JWT authentication and admin authorization
router.use(protect, requireAdmin);

router.get('/bookings', getAdminBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);

export default router;
