import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

const connectDB = async () => {
  try {
    if (!fsSync.existsSync(DATA_DIR)) {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }

    const collections = ['users', 'hotels', 'rooms', 'bookings'];
    for (const col of collections) {
      const colFile = path.join(DATA_DIR, `${col}.json`);
      if (!fsSync.existsSync(colFile)) {
        await fs.writeFile(colFile, '[]', 'utf-8');
      }
    }

    console.log(`Self-Contained JSON Database Initialized at: ${DATA_DIR}`);
    return true;
  } catch (error) {
    console.error(`Database Initialization Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
