import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, get, run, all } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create migrations table if it doesn't exist
function createMigrationsTable() {
  exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      executed_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Get executed migrations
function getExecutedMigrations() {
  const result = all('SELECT name FROM migrations ORDER BY id');
  return result.map(row => row.name);
}

// Run a single migration
async function runMigration(filename) {
  const filePath = path.join(__dirname, filename);
  const migration = await import(filePath);

  console.log(`Running migration: ${filename}`);
  await migration.up();

  run('INSERT INTO migrations (name) VALUES (?)', [filename]);
  console.log(`Completed migration: ${filename}`);
}

// Main migration runner
async function runMigrations() {
  try {
    createMigrationsTable();

    const executedMigrations = getExecutedMigrations();
    const files = fs.readdirSync(__dirname)
      .filter(f => f.match(/^\d{14}_.*\.js$/))
      .sort();

    const pendingMigrations = files.filter(f => !executedMigrations.includes(f));

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      process.exit(0);
    }

    console.log(`Found ${pendingMigrations.length} pending migration(s)`);

    for (const file of pendingMigrations) {
      await runMigration(file);
    }

    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
