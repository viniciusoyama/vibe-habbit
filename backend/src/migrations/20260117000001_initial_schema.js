import { exec } from '../config/database.js';

export async function up() {
  // Users table
  exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Characters table
  exec(`
    CREATE TABLE characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL DEFAULT 'Hero',
      head INTEGER NOT NULL DEFAULT 0,
      chest INTEGER NOT NULL DEFAULT 0,
      legs INTEGER NOT NULL DEFAULT 0,
      weapon INTEGER NOT NULL DEFAULT 0,
      accessory INTEGER NOT NULL DEFAULT 0,
      total_xp INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id)
    )
  `);

  // Skills table
  exec(`
    CREATE TABLE skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      level INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Habits table
  exec(`
    CREATE TABLE habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      skill_id INTEGER,
      name TEXT NOT NULL,
      xp INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL
    )
  `);

  // Completions table
  exec(`
    CREATE TABLE completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      completed_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
      UNIQUE(habit_id, completed_date)
    )
  `);

  // Create indexes for better query performance
  exec(`CREATE INDEX idx_characters_user_id ON characters(user_id)`);
  exec(`CREATE INDEX idx_skills_user_id ON skills(user_id)`);
  exec(`CREATE INDEX idx_habits_user_id ON habits(user_id)`);
  exec(`CREATE INDEX idx_habits_skill_id ON habits(skill_id)`);
  exec(`CREATE INDEX idx_completions_habit_id ON completions(habit_id)`);
  exec(`CREATE INDEX idx_completions_date ON completions(completed_date)`);

  console.log('Initial schema created successfully');
}

export async function down() {
  exec(`DROP TABLE IF EXISTS completions`);
  exec(`DROP TABLE IF EXISTS habits`);
  exec(`DROP TABLE IF EXISTS skills`);
  exec(`DROP TABLE IF EXISTS characters`);
  exec(`DROP TABLE IF EXISTS users`);

  console.log('Schema dropped successfully');
}
