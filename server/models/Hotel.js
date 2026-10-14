import { readCollection, writeCollection, generateId } from '../db/jsonStore.js';

const COLLECTION = 'hotels';

class HotelQueryChain {
  constructor(queryPromise) {
    this.queryPromise = queryPromise;
    this.sortCriteria = null;
  }

  sort(criteria) {
    this.sortCriteria = criteria;
    return this;
  }

  async then(resolve, reject) {
    try {
      let hotels = await this.queryPromise;
      if (this.sortCriteria) {
        const key = Object.keys(this.sortCriteria)[0];
        const dir = this.sortCriteria[key];

        hotels = [...hotels].sort((a, b) => {
          const valA = a[key] !== undefined ? a[key] : 0;
          const valB = b[key] !== undefined ? b[key] : 0;
          if (dir === -1) {
            return valB > valA ? 1 : valB < valA ? -1 : 0;
          }
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        });
      }
      return resolve(hotels);
    } catch (err) {
      if (reject) return reject(err);
      throw err;
    }
  }
}

const Hotel = {
  find(query = {}) {
    const promise = (async () => {
      const hotels = await readCollection(COLLECTION);
      let filtered = hotels;

      // Filter by city
      if (query.city) {
        if (query.city instanceof RegExp) {
          filtered = filtered.filter((h) => query.city.test(h.city));
        } else if (typeof query.city === 'object' && query.city.$regex) {
          filtered = filtered.filter((h) => query.city.$regex.test(h.city));
        } else {
          filtered = filtered.filter(
            (h) => h.city && h.city.toLowerCase() === String(query.city).toLowerCase()
          );
        }
      }

      // Filter by keyword search ($or)
      if (query.$or && Array.isArray(query.$or)) {
        filtered = filtered.filter((h) => {
          return query.$or.some((condition) => {
            const field = Object.keys(condition)[0];
            const pattern = condition[field];
            const value = h[field];
            if (!value) return false;
            if (pattern instanceof RegExp) {
              return pattern.test(value);
            }
            return String(value).toLowerCase().includes(String(pattern).toLowerCase());
          });
        });
      }

      // Filter by rating ($gte)
      if (query.rating && query.rating.$gte !== undefined) {
        filtered = filtered.filter((h) => Number(h.rating) >= Number(query.rating.$gte));
      }

      // Filter by startingPrice ($gte, $lte)
      if (query.startingPrice) {
        if (query.startingPrice.$gte !== undefined) {
          filtered = filtered.filter(
            (h) => Number(h.startingPrice) >= Number(query.startingPrice.$gte)
          );
        }
        if (query.startingPrice.$lte !== undefined) {
          filtered = filtered.filter(
            (h) => Number(h.startingPrice) <= Number(query.startingPrice.$lte)
          );
        }
      }

      // Filter by amenities ($in)
      if (query.amenities && query.amenities.$in) {
        filtered = filtered.filter((h) => {
          if (!h.amenities || !Array.isArray(h.amenities)) return false;
          return query.amenities.$in.some((reqAmenity) => {
            if (reqAmenity instanceof RegExp) {
              return h.amenities.some((a) => reqAmenity.test(a));
            }
            return h.amenities.some(
              (a) => a.toLowerCase() === String(reqAmenity).toLowerCase()
            );
          });
        });
      }

      // Filter by _id ($in)
      if (query._id && query._id.$in) {
        const idList = query._id.$in.map(String);
        filtered = filtered.filter((h) => idList.includes(String(h._id || h.id)));
      }

      return filtered;
    })();

    return new HotelQueryChain(promise);
  },

  async findById(id) {
    const hotels = await readCollection(COLLECTION);
    const targetId = String(id);
    return hotels.find((h) => String(h._id) === targetId || String(h.id) === targetId) || null;
  },

  async findOne(query = {}) {
    const hotels = await readCollection(COLLECTION);
    if (query._id) {
      return hotels.find((h) => String(h._id) === String(query._id) || String(h.id) === String(query._id)) || null;
    }
    if (query.name) {
      if (query.name instanceof RegExp) {
        return hotels.find((h) => query.name.test(h.name)) || null;
      }
      return hotels.find((h) => h.name.toLowerCase() === String(query.name).toLowerCase()) || null;
    }
    return hotels[0] || null;
  },

  async create(data) {
    const hotels = await readCollection(COLLECTION);
    const id = data._id || data.id || generateId();
    const now = new Date().toISOString();

    const newHotel = {
      _id: id,
      id: id,
      name: data.name,
      description: data.description,
      location: data.location,
      address: data.address || `${data.location}, India`,
      city: data.city,
      images: data.images || [],
      rating: Number(data.rating) || 4.5,
      reviewsCount: Number(data.reviewsCount) || 0,
      amenities: data.amenities || [],
      startingPrice: Number(data.startingPrice) || 0,
      createdAt: now,
      updatedAt: now
    };

    hotels.push(newHotel);
    await writeCollection(COLLECTION, hotels);
    return newHotel;
  },

  async findByIdAndUpdate(id, updateData, options = {}) {
    const hotels = await readCollection(COLLECTION);
    const targetId = String(id);
    const index = hotels.findIndex(
      (h) => String(h._id) === targetId || String(h.id) === targetId
    );

    if (index === -1) return null;

    hotels[index] = {
      ...hotels[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await writeCollection(COLLECTION, hotels);
    return hotels[index];
  },

  async findByIdAndDelete(id) {
    const hotels = await readCollection(COLLECTION);
    const targetId = String(id);
    const index = hotels.findIndex(
      (h) => String(h._id) === targetId || String(h.id) === targetId
    );

    if (index === -1) return null;

    const [deleted] = hotels.splice(index, 1);
    await writeCollection(COLLECTION, hotels);
    return deleted;
  },

  async countDocuments(filter = {}) {
    const hotels = await readCollection(COLLECTION);
    return hotels.length;
  },

  async deleteMany(filter = {}) {
    await writeCollection(COLLECTION, []);
    return { deletedCount: 0 };
  }
};

export default Hotel;
