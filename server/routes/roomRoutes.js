import express from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getRooms)
  .post(protect, requireAdmin, createRoom);

router
  .route('/:id')
  .get(getRoomById)
  .put(protect, requireAdmin, updateRoom)
  .delete(protect, requireAdmin, deleteRoom);

export default router;
