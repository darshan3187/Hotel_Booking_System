import bcrypt from 'bcryptjs';
import { readCollection, writeCollection, generateId } from '../db/jsonStore.js';

const COLLECTION = 'users';

const attachUserMethods = (user) => {
  if (!user) return null;
  const userObj = { ...user };
  userObj.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  userObj.toJSON = function () {
    const copy = { ...this };
    delete copy.password;
    return copy;
  };
  return userObj;
};

class UserQueryChain {
  constructor(promise) {
    this.promise = promise;
  }

  async select(fields) {
    const users = await this.promise;
    if (fields === '-password') {
      if (Array.isArray(users)) {
        return users.map((u) => {
          const { password, ...rest } = u;
          return attachUserMethods(rest);
        });
      } else if (users) {
        const { password, ...rest } = users;
        return attachUserMethods(rest);
      }
    }
    return users;
  }

  async sort(sortCriteria) {
    let users = await this.promise;
    if (Array.isArray(users) && sortCriteria) {
      const key = Object.keys(sortCriteria)[0];
      const dir = sortCriteria[key];
      users = [...users].sort((a, b) => {
        if (dir === -1) return new Date(b[key]) - new Date(a[key]);
        return new Date(a[key]) - new Date(b[key]);
      });
    }
    return users;
  }

  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }
}

const User = {
  async find(filter = {}) {
    const users = await readCollection(COLLECTION);
    let result = users;

    if (filter.role) {
      result = result.filter((u) => u.role === filter.role);
    }

    const queryPromise = Promise.resolve(result.map(attachUserMethods));
    return new UserQueryChain(queryPromise);
  },

  async findOne(filter = {}) {
    const users = await readCollection(COLLECTION);
    let matched = null;

    if (filter.email) {
      const targetEmail = filter.email.toLowerCase().trim();
      matched = users.find(
        (u) => u.email && u.email.toLowerCase().trim() === targetEmail
      );
    } else if (filter._id) {
      matched = users.find((u) => u._id === filter._id || u.id === filter._id);
    }

    return matched ? attachUserMethods(matched) : null;
  },

  findById(id) {
    const promise = (async () => {
      const users = await readCollection(COLLECTION);
      const matched = users.find((u) => u._id === id || u.id === id);
      return matched ? attachUserMethods(matched) : null;
    })();
    return new UserQueryChain(promise);
  },

  async create(userData) {
    const users = await readCollection(COLLECTION);
    const id = generateId();

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const now = new Date().toISOString();

    const newUser = {
      _id: id,
      id: id,
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      phone: userData.phone.trim(),
      role: userData.role === 'admin' ? 'admin' : 'user',
      createdAt: now,
      updatedAt: now
    };

    users.push(newUser);
    await writeCollection(COLLECTION, users);

    return attachUserMethods(newUser);
  },

  async countDocuments(filter = {}) {
    const users = await readCollection(COLLECTION);
    if (!filter || Object.keys(filter).length === 0) {
      return users.length;
    }
    return users.filter((u) => {
      for (const [key, val] of Object.entries(filter)) {
        if (u[key] !== val) return false;
      }
      return true;
    }).length;
  },

  async deleteMany(filter = {}) {
    if (!filter || Object.keys(filter).length === 0) {
      await writeCollection(COLLECTION, []);
      return { deletedCount: 0 };
    }
    const users = await readCollection(COLLECTION);
    const kept = users.filter((u) => {
      for (const [key, val] of Object.entries(filter)) {
        if (u[key] === val) return false;
      }
      return true;
    });
    await writeCollection(COLLECTION, kept);
    return { deletedCount: users.length - kept.length };
  }
};

export default User;
