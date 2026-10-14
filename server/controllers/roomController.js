import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';

// @desc    Get all rooms (optionally filtered by hotelId or roomType)
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res, next) => {
  try {
    const { hotelId, roomType, capacity, isAvailable } = req.query;
    const query = {};

    if (hotelId) {
      query.hotelId = hotelId;
    }
    if (roomType) {
      query.roomType = roomType;
    }
    if (capacity) {
      query.capacity = { $gte: Number(capacity) };
    }
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const rooms = await Room.find(query).populate('hotelId', 'name city location');

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: { rooms }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id).populate('hotelId');
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: { room }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a room under a hotel
// @route   POST /api/rooms
// @access  Admin Only
export const createRoom = async (req, res, next) => {
  try {
    const {
      hotelId,
      roomNumber,
      roomType,
      description,
      pricePerNight,
      capacity,
      amenities,
      images,
      isAvailable
    } = req.body;

    if (!hotelId || !roomNumber || !roomType || pricePerNight === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide hotelId, roomNumber, roomType, and pricePerNight.'
      });
    }

    // Verify hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Associated hotel property not found.'
      });
    }

    const room = await Room.create({
      hotelId,
      roomNumber,
      roomType,
      description: description || '',
      pricePerNight,
      capacity: capacity || 2,
      amenities: amenities || [],
      images: images || [],
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });

    // Update hotel startingPrice if this room has a lower price or startingPrice is 0
    if (hotel.startingPrice === 0 || pricePerNight < hotel.startingPrice) {
      hotel.startingPrice = pricePerNight;
      await hotel.save();
    }

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Admin Only
export const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await Room.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found for update.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Admin Only
export const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found for deletion.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
