import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Ensure data directory exists
if (!fsSync.existsSync(DATA_DIR)) {
  fsSync.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate MongoDB-compatible 24-char hex string
export const generateId = () => crypto.randomBytes(12).toString('hex');

// Read collection from file
export const readCollection = async (collectionName) => {
  const filePath = path.join(DATA_DIR, `${collectionName}.json`);
  try {
    if (!fsSync.existsSync(filePath)) {
      await fs.writeFile(filePath, '[]', 'utf-8');
      return [];
    }
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (error) {
    console.error(`Error reading ${collectionName}.json:`, error.message);
    return [];
  }
};

// Write collection to file atomically
export const writeCollection = async (collectionName, data) => {
  const filePath = path.join(DATA_DIR, `${collectionName}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${collectionName}.json:`, error.message);
    throw error;
  }
};

export const getCollectionPath = (collectionName) => {
  return path.join(DATA_DIR, `${collectionName}.json`);
};
