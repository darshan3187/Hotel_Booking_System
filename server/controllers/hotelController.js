import mongoose from 'mongoose';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

// @desc    Get all hotels with search, filtering, and sorting
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res, next) => {
  try {
    const {
      city,
      search,
      minPrice,
      maxPrice,
      rating,
      roomType,
      amenities,
      sortBy
    } = req.query;

    const query = {};

    // Filter by city
    if (city && city.trim() !== '') {
      query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    }

    // Search keyword
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { city: searchRegex },
        { location: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filter by rating
    if (rating && !isNaN(Number(rating))) {
      query.rating = { $gte: Number(rating) };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        query.startingPrice.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.startingPrice.$lte = Number(maxPrice);
      }
    }

    // Filter by amenities
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim()).filter(Boolean);

      if (amenitiesList.length > 0) {
        query.amenities = {
          $in: amenitiesList.map((a) => new RegExp(a, 'i'))
        };
      }
    }

    // If roomType filter is requested, find hotels that offer that room type
    if (roomType && roomType.trim() !== '') {
      const roomsMatching = await Room.find({
        roomType: { $regex: new RegExp(roomType.trim(), 'i') },
        isAvailable: true
      }).select('hotelId');

      const hotelIds = roomsMatching.map((r) => r.hotelId);
      query._id = { $in: hotelIds };
    }

    // Sorting
    let sort = {};
    if (sortBy === 'price_asc') {
      sort.startingPrice = 1;
    } else if (sortBy === 'price_desc') {
      sort.startingPrice = -1;
    } else if (sortBy === 'rating_desc') {
      sort.rating = -1;
    } else {
      sort.rating = -1; // Default recommended
      sort.createdAt = -1;
    }

    const hotels = await Hotel.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: {
        hotels,
        count: hotels.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel by ID with associated rooms
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let hotel;
    if (mongoose.Types.ObjectId.isValid(id)) {
      hotel = await Hotel.findById(id);
    } else {
      // Allow fallback search by custom id if applicable
      hotel = await Hotel.findOne({ $or: [{ _id: id }, { name: new RegExp(id, 'i') }] });
    }

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel property not found.'
      });
    }

    // Fetch associated rooms
    const rooms = await Room.find({ hotelId: hotel._id, isAvailable: true });

    res.status(200).json({
      success: true,
      data: {
        hotel,
        rooms
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new hotel property
// @route   POST /api/hotels
// @access  Admin Only
export const createHotel = async (req, res, next) => {
  try {
    const {
      name,
      description,
      location,
      address,
      city,
      images,
      rating,
      amenities,
      startingPrice
    } = req.body;

    if (!name || !description || !location || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required property details: name, description, location, and city.'
      });
    }

    const hotel = await Hotel.create({
      name,
      description,
      location,
      address: address || '',
      city,
      images: images || [],
      rating: rating || 4.5,
      amenities: amenities || [],
      startingPrice: startingPrice || 0
    });

    res.status(201).json({
      success: true,
      message: 'Hotel property added successfully',
      data: { hotel }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing hotel property
// @route   PUT /api/hotels/:id
// @access  Admin Only
export const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel property not found for update.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hotel property updated successfully',
      data: { hotel }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a hotel and its associated rooms
// @route   DELETE /api/hotels/:id
// @access  Admin Only
export const deleteHotel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByIdAndDelete(id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel property not found for deletion.'
      });
    }

    // Cascade delete associated rooms
    await Room.deleteMany({ hotelId: id });

    res.status(200).json({
      success: true,
      message: 'Hotel property and associated rooms removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
