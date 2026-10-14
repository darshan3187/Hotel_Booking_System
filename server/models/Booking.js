import { readCollection, writeCollection, generateId } from '../db/jsonStore.js';

const COLLECTION = 'bookings';

class BookingQueryChain {
  constructor(bookingsPromise) {
    this.bookingsPromise = bookingsPromise;
    this.populateFields = [];
    this.sortCriteria = null;
    this.limitCount = null;
  }

  populate(field, selectFields) {
    this.populateFields.push({ field, selectFields });
    return this;
  }

  sort(sortCriteria) {
    this.sortCriteria = sortCriteria;
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  async then(resolve, reject) {
    try {
      let data = await this.bookingsPromise;
      const isArray = Array.isArray(data);
      let items = isArray ? data : data ? [data] : [];

      if (items.length > 0) {
        for (const { field } of this.populateFields) {
          if (field === 'hotelId') {
            const hotels = await readCollection('hotels');
            items.forEach((b) => {
              if (b && b.hotelId) {
                const targetId = String(b.hotelId._id || b.hotelId.id || b.hotelId);
                const found = hotels.find(
                  (h) => String(h._id) === targetId || String(h.id) === targetId
                );
                if (found) b.hotelId = found;
              }
            });
          } else if (field === 'roomId') {
            const rooms = await readCollection('rooms');
            items.forEach((b) => {
              if (b && b.roomId) {
                const targetId = String(b.roomId._id || b.roomId.id || b.roomId);
                const found = rooms.find(
                  (r) => String(r._id) === targetId || String(r.id) === targetId
                );
                if (found) b.roomId = found;
              }
            });
          } else if (field === 'userId') {
            const users = await readCollection('users');
            items.forEach((b) => {
              if (b && b.userId) {
                const targetId = String(b.userId._id || b.userId.id || b.userId);
                const found = users.find(
                  (u) => String(u._id) === targetId || String(u.id) === targetId
                );
                if (found) {
                  b.userId = {
                    _id: found._id,
                    name: found.name,
                    email: found.email,
                    phone: found.phone,
                    role: found.role
                  };
                }
              }
            });
          }
        }

        if (this.sortCriteria && isArray) {
          const key = Object.keys(this.sortCriteria)[0];
          const dir = this.sortCriteria[key];
          items = [...items].sort((a, b) => {
            const valA = new Date(a[key] || 0).getTime();
            const valB = new Date(b[key] || 0).getTime();
            if (dir === -1) return valB - valA;
            return valA - valB;
          });
        }

        if (this.limitCount && isArray) {
          items = items.slice(0, this.limitCount);
        }
      }

      const result = isArray ? items : items[0] || null;
      return resolve(result);
    } catch (err) {
      if (reject) return reject(err);
      throw err;
    }
  }
}

const Booking = {
  find(query = {}) {
    const promise = (async () => {
      const bookings = await readCollection(COLLECTION);
      let filtered = bookings;

      if (query.userId) {
        const targetUserId = String(query.userId);
        filtered = filtered.filter(
          (b) => String(b.userId) === targetUserId || String(b.userId?._id) === targetUserId
        );
      }

      if (query.status) {
        if (typeof query.status === 'object' && query.status.$ne) {
          filtered = filtered.filter((b) => b.status !== query.status.$ne);
        } else {
          filtered = filtered.filter((b) => b.status === query.status);
        }
      }

      return filtered.map((b) => ({ ...b }));
    })();

    return new BookingQueryChain(promise);
  },

  findById(id) {
    const promise = (async () => {
      const bookings = await readCollection(COLLECTION);
      const targetId = String(id);
      const found = bookings.find(
        (b) => String(b._id) === targetId || String(b.id) === targetId
      );
      return found ? { ...found } : null;
    })();

    return new BookingQueryChain(promise);
  },

  async findOne(query = {}) {
    const bookings = await readCollection(COLLECTION);

    // Overlapping double-booking check
    if (query.roomId) {
      const targetRoomId = String(query.roomId);
      const allowedStatuses = query.status?.$in || ['pending', 'confirmed'];
      const checkInLt = query.checkIn?.$lt ? new Date(query.checkIn.$lt).getTime() : null;
      const checkOutGt = query.checkOut?.$gt ? new Date(query.checkOut.$gt).getTime() : null;

      const conflict = bookings.find((b) => {
        if (String(b.roomId) !== targetRoomId) return false;
        if (!allowedStatuses.includes(b.status)) return false;

        const bCheckIn = new Date(b.checkIn).getTime();
        const bCheckOut = new Date(b.checkOut).getTime();

        if (checkInLt !== null && bCheckIn >= checkInLt) return false;
        if (checkOutGt !== null && bCheckOut <= checkOutGt) return false;

        return true;
      });

      return conflict ? { ...conflict } : null;
    }

    if (query._id) {
      const targetId = String(query._id);
      const found = bookings.find(
        (b) => String(b._id) === targetId || String(b.id) === targetId
      );
      return found ? { ...found } : null;
    }

    return bookings[0] ? { ...bookings[0] } : null;
  },

  async create(data) {
    const bookings = await readCollection(COLLECTION);
    const id = data._id || data.id || generateId();
    const now = new Date().toISOString();

    const newBooking = {
      _id: id,
      id: id,
      userId: String(data.userId._id || data.userId.id || data.userId),
      hotelId: String(data.hotelId._id || data.hotelId.id || data.hotelId),
      roomId: String(data.roomId._id || data.roomId.id || data.roomId),
      checkIn: new Date(data.checkIn).toISOString(),
      checkOut: new Date(data.checkOut).toISOString(),
      guests: Number(data.guests) || 1,
      totalAmount: Number(data.totalAmount) || 0,
      status: data.status || 'confirmed',
      guestDetails: data.guestDetails || {},
      specialRequests: data.specialRequests || '',
      createdAt: now,
      updatedAt: now
    };

    bookings.push(newBooking);
    await writeCollection(COLLECTION, bookings);
    return { ...newBooking };
  },

  findByIdAndUpdate(id, updateData, options = {}) {
    const promise = (async () => {
      const bookings = await readCollection(COLLECTION);
      const targetId = String(id);
      const index = bookings.findIndex(
        (b) => String(b._id) === targetId || String(b.id) === targetId
      );

      if (index === -1) return null;

      bookings[index] = {
        ...bookings[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      await writeCollection(COLLECTION, bookings);
      return { ...bookings[index] };
    })();

    return new BookingQueryChain(promise);
  },

  async aggregate(pipeline) {
    const bookings = await readCollection(COLLECTION);
    let result = bookings;
    for (const stage of pipeline) {
      if (stage.$match) {
        if (stage.$match.status && stage.$match.status.$ne) {
          result = result.filter((b) => b.status !== stage.$match.status.$ne);
        }
      }
      if (stage.$group) {
        const totalRevenue = result.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
        return [{ _id: null, totalRevenue }];
      }
    }
    return result;
  },

  async countDocuments(filter = {}) {
    const bookings = await readCollection(COLLECTION);
    return bookings.length;
  },

  async deleteMany(filter = {}) {
    await writeCollection(COLLECTION, []);
    return { deletedCount: 0 };
  }
};

export default Booking;
