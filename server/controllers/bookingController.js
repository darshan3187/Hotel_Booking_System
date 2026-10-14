import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

// @desc    Validate availability & create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const {
      hotelId,
      roomId,
      checkIn,
      checkOut,
      guests,
      guestDetails,
      specialRequests
    } = req.body;

    if (!hotelId || !roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide hotelId, roomId, check-in, and check-out dates.'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date format.'
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after the check-in date.'
      });
    }

    // Verify room existence and capacity
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Selected room does not exist.'
      });
    }

    if (!room.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This room is currently marked unavailable by the hotel.'
      });
    }

    const guestCount = Number(guests) || 1;
    if (guestCount > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `Guest count (${guestCount}) exceeds the maximum capacity of ${room.capacity} for this room.`
      });
    }

    // Concurrency / Double-booking prevention check
    const overlappingBooking = await Booking.findOne({
      roomId: room._id,
      status: { $in: ['pending', 'confirmed'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This room is no longer available for the chosen dates.'
      });
    }

    // Calculate nights & independent server pricing
    const diffMs = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const subtotal = nights * room.pricePerNight;
    const taxes = Math.round(subtotal * 0.12); // 12% GST
    const totalAmount = subtotal + taxes;

    // Create reservation
    const booking = await Booking.create({
      userId: req.user._id,
      hotelId: room.hotelId,
      roomId: room._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestCount,
      totalAmount,
      status: 'confirmed',
      guestDetails: guestDetails || {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      },
      specialRequests: specialRequests || ''
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('hotelId')
      .populate('roomId');

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully',
      data: {
        booking: populatedBooking
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings belonging to currently logged in traveler
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hotelId')
      .populate('roomId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: { bookings }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('userId', 'name email phone')
      .populate('hotelId')
      .populate('roomId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    // Check ownership or admin
    if (
      booking.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this reservation.'
      });
    }

    res.status(200).json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found for cancellation.'
      });
    }

    // Authorization
    if (
      booking.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This reservation is already cancelled.'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform reservations (Admin)
// @route   GET /api/admin/bookings
// @access  Admin Only
export const getAdminBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('hotelId')
      .populate('roomId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: { bookings }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reservation status (Admin)
// @route   PATCH /api/admin/bookings/:id/status
// @access  Admin Only
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email phone')
      .populate('hotelId')
      .populate('roomId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get administrative dashboard statistics & metrics
// @route   GET /api/admin/stats
// @access  Admin Only
export const getAdminStats = async (req, res, next) => {
  try {
    const totalHotels = await Hotel.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalGuests = await User.countDocuments({ role: 'user' });

    // Compute realized revenue (excluding cancelled bookings)
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Recent 6 bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('hotelId', 'name city')
      .populate('roomId', 'roomType pricePerNight')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalHotels,
          totalRooms,
          totalBookings,
          totalGuests,
          totalRevenue,
          recentBookings
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user directory (Admin)
// @route   GET /api/admin/users
// @access  Admin Only
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};
