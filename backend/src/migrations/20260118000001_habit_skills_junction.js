import { exec, all, run } from '../config/database.js';

export async function up() {
  // Create habit_skills junction table for many-to-many relationship
  exec(`
    CREATE TABLE habit_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      skill_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
      FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
      UNIQUE(habit_id, skill_id)
    )
  `);

  // Create indexes for better query performance
  exec(`CREATE INDEX idx_habit_skills_habit_id ON habit_skills(habit_id)`);
  exec(`CREATE INDEX idx_habit_skills_skill_id ON habit_skills(skill_id)`);

  // Migrate existing skill_id data from habits table to habit_skills
  const habitsWithSkills = all(
    'SELECT id, skill_id FROM habits WHERE skill_id IS NOT NULL'
  );

  for (const habit of habitsWithSkills) {
    run(
      'INSERT INTO habit_skills (habit_id, skill_id) VALUES (?, ?)',
      [habit.id, habit.skill_id]
    );
  }

  // Clear the old skill_id column (keep column for rollback safety)
  exec('UPDATE habits SET skill_id = NULL');

  console.log('habit_skills junction table created and data migrated successfully');
}

export async function down() {
  // Restore skill_id data from habit_skills (pick first skill for each habit)
  const habitSkills = all(`
    SELECT habit_id, MIN(skill_id) as skill_id
    FROM habit_skills
    GROUP BY habit_id
  `);

  for (const hs of habitSkills) {
    run(
      'UPDATE habits SET skill_id = ? WHERE id = ?',
      [hs.skill_id, hs.habit_id]
    );
  }

  // Drop the junction table
  exec('DROP TABLE IF EXISTS habit_skills');

  console.log('habit_skills junction table dropped and data restored');
}
