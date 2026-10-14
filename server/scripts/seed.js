import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { HOTELS_DATA } from '../../client/src/data/hotelsData.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Initializing self-contained database for seeding...');
    await connectDB();

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});

    console.log('Seeding administrative and customer accounts...');
    // Create Admin
    const adminUser = await User.create({
      name: 'Admin Host',
      email: 'admin@stayease.com',
      password: 'admin123',
      phone: '+91 98765 43210',
      role: 'admin'
    });

    // Create Customer
    const guestUser = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan@gmail.com',
      password: 'user123',
      phone: '+91 98111 22334',
      role: 'user'
    });

    console.log(`Created users: Admin (${adminUser.email}) and Traveler (${guestUser.email})`);

    console.log(`Seeding ${HOTELS_DATA.length} curated luxury & heritage hotels across India...`);
    let totalRoomsCreated = 0;
    let firstHotelId = null;
    let firstRoomId = null;

    for (let i = 0; i < HOTELS_DATA.length; i++) {
      const hData = HOTELS_DATA[i];

      const hotel = await Hotel.create({
        name: hData.name,
        description: hData.description,
        location: hData.location,
        address: `${hData.location}, India`,
        city: hData.city,
        images: hData.images || [],
        rating: hData.rating || 4.8,
        reviewsCount: hData.reviewsCount || 45,
        amenities: hData.amenities || [],
        startingPrice: hData.startingPrice || 5000
      });

      if (!firstHotelId) {
        firstHotelId = hotel._id;
      }

      // Seed rooms for this hotel
      if (hData.rooms && hData.rooms.length > 0) {
        for (let r = 0; r < hData.rooms.length; r++) {
          const rData = hData.rooms[r];
          const room = await Room.create({
            hotelId: hotel._id,
            roomNumber: rData.roomNumber || `${101 + r}`,
            roomType: rData.roomType || 'Deluxe',
            description: rData.description || `${rData.roomType} with bespoke interior details`,
            pricePerNight: rData.pricePerNight || hotel.startingPrice,
            capacity: rData.capacity || 2,
            amenities: rData.amenities || hotel.amenities.slice(0, 4),
            images: rData.images || hotel.images,
            isAvailable: true
          });

          if (!firstRoomId) {
            firstRoomId = room._id;
          }
          totalRoomsCreated++;
        }
      }
    }

    console.log(`Seeded ${HOTELS_DATA.length} hotels and ${totalRoomsCreated} rooms.`);

    // Seed initial demo booking for Rohan Sharma
    if (firstHotelId && firstRoomId) {
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 5);
      const checkOut = new Date();
      checkOut.setDate(checkOut.getDate() + 8);

      const firstRoom = await Room.findById(firstRoomId);
      const nights = 3;
      const subtotal = nights * firstRoom.pricePerNight;
      const totalAmount = Math.round(subtotal * 1.12);

      await Booking.create({
        userId: guestUser._id,
        hotelId: firstHotelId,
        roomId: firstRoomId,
        checkIn,
        checkOut,
        guests: 2,
        totalAmount,
        status: 'confirmed',
        guestDetails: {
          name: guestUser.name,
          email: guestUser.email,
          phone: guestUser.phone
        },
        specialRequests: 'Upper floor with courtyard view preferred.'
      });
      console.log('Created sample confirmed reservation for Rohan Sharma.');
    }

    console.log('\n==========================================');
    console.log('  Database Seeding Completed Successfully! ');
    console.log('==========================================');
    console.log('Admin Credentials:   admin@stayease.com / admin123');
    console.log('User Credentials:    rohan@gmail.com / user123');
    console.log(`Total Hotels:        ${HOTELS_DATA.length}`);
    console.log(`Total Rooms:         ${totalRoomsCreated}`);
    console.log('Database Mode:       Self-Contained JSON (Zero MongoDB needed)');
    console.log('Data Directory:      server/data/');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
