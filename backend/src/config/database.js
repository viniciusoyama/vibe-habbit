import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/habbit.db');

// Create data directory if it doesn't exist
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

console.log(`Database initialized at: ${dbPath}`);

// Helper function to run a query (INSERT, UPDATE, DELETE)
export const run = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    const result = stmt.run(...params);
    return result;
  } catch (error) {
    console.error('Database run error:', error);
    throw error;
  }
};

// Helper function to get a single row
export const get = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    const result = stmt.get(...params);
    return result;
  } catch (error) {
    console.error('Database get error:', error);
    throw error;
  }
};

// Helper function to get all rows
export const all = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    const result = stmt.all(...params);
    return result;
  } catch (error) {
    console.error('Database all error:', error);
    throw error;
  }
};

// Transaction helper
export const transaction = (callback) => {
  const trx = db.transaction(callback);
  return trx();
};

// Execute raw SQL (for migrations)
export const exec = (sql) => {
  try {
    db.exec(sql);
  } catch (error) {
    console.error('Database exec error:', error);
    throw error;
  }
};

// Close database connection
export const close = () => {
  db.close();
};

export default db;
