import express from 'express';
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
} from '../controllers/hotelController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getHotels)
  .post(protect, requireAdmin, createHotel);

router
  .route('/:id')
  .get(getHotelById)
  .put(protect, requireAdmin, updateHotel)
  .delete(protect, requireAdmin, deleteHotel);

export default router;
