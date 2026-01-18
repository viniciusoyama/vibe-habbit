import { exec, get } from '../config/database.js';

export async function up() {
  // Check if user with id=1 already exists
  const existingUser = get('SELECT id FROM users WHERE id = 1');

  if (!existingUser) {
    // Insert default user with id=1
    exec(`
      INSERT INTO users (id, email, password_hash, created_at, updated_at)
      VALUES (1, 'default@local', 'none', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    // Insert default character for this user
    exec(`
      INSERT INTO characters (user_id, name, head, chest, legs, weapon, accessory, total_xp, created_at, updated_at)
      VALUES (1, 'Hero', 0, 0, 0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    console.log('Default user and character created successfully');
  } else {
    console.log('Default user already exists, skipping creation');
  }
}

export async function down() {
  // Remove the default character first (due to foreign key constraint)
  exec('DELETE FROM characters WHERE user_id = 1');

  // Remove the default user
  exec('DELETE FROM users WHERE id = 1');

  console.log('Default user and character removed successfully');
}
