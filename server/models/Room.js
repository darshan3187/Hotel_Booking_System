import { readCollection, writeCollection, generateId } from '../db/jsonStore.js';

const COLLECTION = 'rooms';

class RoomQueryChain {
  constructor(roomsPromise) {
    this.roomsPromise = roomsPromise;
    this.populateFields = [];
    this.selectFields = null;
  }

  populate(field, select) {
    this.populateFields.push({ field, select });
    return this;
  }

  select(fields) {
    this.selectFields = fields;
    return this;
  }

  async then(resolve, reject) {
    try {
      let rooms = await this.roomsPromise;

      for (const { field } of this.populateFields) {
        if (field === 'hotelId') {
          const hotels = await readCollection('hotels');
          const pop = (r) => {
            const h = hotels.find(
              (x) => String(x._id) === String(r.hotelId) || String(x.id) === String(r.hotelId)
            );
            return {
              ...r,
              hotelId: h || r.hotelId
            };
          };

          rooms = Array.isArray(rooms)
            ? rooms.map(pop)
            : rooms
            ? pop(rooms)
            : null;
        }
      }

      if (this.selectFields === 'hotelId') {
        if (Array.isArray(rooms)) {
          rooms = rooms.map((r) => ({ hotelId: r.hotelId }));
        }
      }

      return resolve(rooms);
    } catch (err) {
      if (reject) return reject(err);
      throw err;
    }
  }
}

const Room = {
  find(query = {}) {
    const promise = (async () => {
      const rooms = await readCollection(COLLECTION);
      let filtered = rooms;

      if (query.hotelId) {
        const targetHotelId = String(query.hotelId);
        filtered = filtered.filter(
          (r) => String(r.hotelId) === targetHotelId
        );
      }

      if (query.roomType) {
        if (query.roomType instanceof RegExp) {
          filtered = filtered.filter((r) => query.roomType.test(r.roomType));
        } else if (typeof query.roomType === 'object' && query.roomType.$regex) {
          filtered = filtered.filter((r) => query.roomType.$regex.test(r.roomType));
        } else {
          filtered = filtered.filter(
            (r) => r.roomType && r.roomType.toLowerCase() === String(query.roomType).toLowerCase()
          );
        }
      }

      if (query.capacity && query.capacity.$gte !== undefined) {
        filtered = filtered.filter(
          (r) => Number(r.capacity) >= Number(query.capacity.$gte)
        );
      }

      if (query.isAvailable !== undefined) {
        filtered = filtered.filter((r) => r.isAvailable === query.isAvailable);
      }

      return filtered;
    })();

    return new RoomQueryChain(promise);
  },

  findById(id) {
    const promise = (async () => {
      const rooms = await readCollection(COLLECTION);
      const targetId = String(id);
      return rooms.find(
        (r) => String(r._id) === targetId || String(r.id) === targetId
      ) || null;
    })();

    return new RoomQueryChain(promise);
  },

  async findOne(query = {}) {
    const rooms = await readCollection(COLLECTION);
    if (query._id) {
      return rooms.find(
        (r) => String(r._id) === String(query._id) || String(r.id) === String(query._id)
      ) || null;
    }
    return rooms[0] || null;
  },

  async create(data) {
    const rooms = await readCollection(COLLECTION);
    const id = data._id || data.id || generateId();
    const now = new Date().toISOString();

    const newRoom = {
      _id: id,
      id: id,
      hotelId: String(data.hotelId),
      roomNumber: String(data.roomNumber),
      roomType: data.roomType,
      description: data.description || '',
      pricePerNight: Number(data.pricePerNight) || 0,
      capacity: Number(data.capacity) || 2,
      amenities: data.amenities || [],
      images: data.images || [],
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      createdAt: now,
      updatedAt: now
    };

    rooms.push(newRoom);
    await writeCollection(COLLECTION, rooms);
    return newRoom;
  },

  async findByIdAndUpdate(id, updateData, options = {}) {
    const rooms = await readCollection(COLLECTION);
    const targetId = String(id);
    const index = rooms.findIndex(
      (r) => String(r._id) === targetId || String(r.id) === targetId
    );

    if (index === -1) return null;

    rooms[index] = {
      ...rooms[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await writeCollection(COLLECTION, rooms);
    return rooms[index];
  },

  async findByIdAndDelete(id) {
    const rooms = await readCollection(COLLECTION);
    const targetId = String(id);
    const index = rooms.findIndex(
      (r) => String(r._id) === targetId || String(r.id) === targetId
    );

    if (index === -1) return null;

    const [deleted] = rooms.splice(index, 1);
    await writeCollection(COLLECTION, rooms);
    return deleted;
  },

  async deleteMany(filter = {}) {
    const rooms = await readCollection(COLLECTION);
    if (!filter || Object.keys(filter).length === 0) {
      await writeCollection(COLLECTION, []);
      return { deletedCount: rooms.length };
    }

    const targetHotelId = filter.hotelId ? String(filter.hotelId) : null;
    const kept = rooms.filter((r) => {
      if (targetHotelId && String(r.hotelId) === targetHotelId) return false;
      return true;
    });

    await writeCollection(COLLECTION, kept);
    return { deletedCount: rooms.length - kept.length };
  },

  async countDocuments(filter = {}) {
    const rooms = await readCollection(COLLECTION);
    return rooms.length;
  }
};

export default Room;
