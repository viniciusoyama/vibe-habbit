import { get, all, run, transaction } from '../config/database.js';

// Get all habits for user
export const getHabits = async (req, res) => {
  try {
    const habits = await all(
      'SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC',
      [1]
    );

    res.json({ habits });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: 'Failed to get habits' });
  }
};

// Create new habit
export const createHabit = async (req, res) => {
  try {
    const { name, skillId } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Habit name is required' });
    }

    // Verify skill belongs to user if skillId provided
    if (skillId) {
      const skillCheck = await get(
        'SELECT id FROM skills WHERE id = ? AND user_id = ?',
        [skillId, 1]
      );
      if (!skillCheck) {
        return res.status(404).json({ error: 'Skill not found' });
      }
    }

    const result = await run(
      'INSERT INTO habits (user_id, name, skill_id) VALUES (?, ?, ?)',
      [1, name.trim(), skillId || null]
    );

    const habit = await get(
      'SELECT * FROM habits WHERE id = ?',
      [result.lastInsertRowid]
    );

    res.status(201).json({
      message: 'Habit created successfully',
      habit
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
};

// Update habit
export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, skillId } = req.body;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push(`name = ?`);
      values.push(name.trim());
    }
    if (skillId !== undefined) {
      // Verify skill belongs to user if skillId provided
      if (skillId !== null) {
        const skillCheck = await get(
          'SELECT id FROM skills WHERE id = ? AND user_id = ?',
          [skillId, 1]
        );
        if (!skillCheck) {
          return res.status(404).json({ error: 'Skill not found' });
        }
      }
      updates.push(`skill_id = ?`);
      values.push(skillId);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(1, id);

    const result = await run(
      `UPDATE habits SET ${updates.join(', ')} WHERE user_id = ? AND id = ?`,
      values
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const habit = await get(
      'SELECT * FROM habits WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Habit updated successfully',
      habit
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ error: 'Failed to update habit' });
  }
};

// Delete habit
export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await get(
      'SELECT * FROM habits WHERE user_id = ? AND id = ?',
      [1, id]
    );

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    await run(
      'DELETE FROM habits WHERE user_id = ? AND id = ?',
      [1, id]
    );

    res.json({
      message: 'Habit deleted successfully',
      habit
    });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
};

// Complete habit for today
export const completeHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date().toISOString().split('T')[0];

    transaction(() => {
      // Verify habit belongs to user
      const habit = get(
        'SELECT id, skill_id, xp FROM habits WHERE id = ? AND user_id = ?',
        [id, 1]
      );

      if (!habit) {
        throw new Error('Habit not found');
      }

      // Check if already completed today
      const completionCheck = get(
        'SELECT id FROM completions WHERE habit_id = ? AND completed_date = ?',
        [id, today]
      );

      if (completionCheck) {
        throw new Error('Habit already completed today');
      }

      // Add completion
      run(
        'INSERT INTO completions (habit_id, completed_date) VALUES (?, ?)',
        [id, today]
      );

      // Increment habit XP
      const newXP = habit.xp + 1;
      run(
        'UPDATE habits SET xp = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newXP, id]
      );

      // Check if skill should level up (every 5 XP)
      if (newXP % 5 === 0 && habit.skill_id) {
        run(
          'UPDATE skills SET level = level + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [habit.skill_id]
        );
      }

      // Increment character total XP
      run(
        'UPDATE characters SET total_xp = total_xp + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [1]
      );

      return true;
    });

    res.json({ message: 'Habit completed successfully' });
  } catch (error) {
    console.error('Complete habit error:', error);
    if (error.message === 'Habit not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Habit already completed today') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to complete habit' });
  }
};

// Uncomplete habit for today
export const uncompleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date().toISOString().split('T')[0];

    transaction(() => {
      // Verify habit belongs to user
      const habit = get(
        'SELECT id, skill_id, xp FROM habits WHERE id = ? AND user_id = ?',
        [id, 1]
      );

      if (!habit) {
        throw new Error('Habit not found');
      }

      // Check if completed today
      const completionResult = get(
        'SELECT id FROM completions WHERE habit_id = ? AND completed_date = ?',
        [id, today]
      );

      if (!completionResult) {
        throw new Error('Habit not completed today');
      }

      // Remove completion
      run(
        'DELETE FROM completions WHERE habit_id = ? AND completed_date = ?',
        [id, today]
      );

      // Check if we need to decrease skill level
      const wasLevelUp = habit.xp % 5 === 0 && habit.xp > 0;

      // Decrement habit XP
      const newXP = Math.max(0, habit.xp - 1);
      run(
        'UPDATE habits SET xp = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newXP, id]
      );

      // Decrease skill level if it was a level-up XP
      if (wasLevelUp && habit.skill_id) {
        run(
          'UPDATE skills SET level = MAX(0, level - 1), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [habit.skill_id]
        );
      }

      // Decrement character total XP
      run(
        'UPDATE characters SET total_xp = MAX(0, total_xp - 1), updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [1]
      );
    });

    res.json({ message: 'Habit uncompleted successfully' });
  } catch (error) {
    console.error('Uncomplete habit error:', error);
    if (error.message === 'Habit not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Habit not completed today') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to uncomplete habit' });
  }
};

// Get completions for user's habits
export const getCompletions = async (req, res) => {
  try {
    const completions = await all(
      `SELECT c.* FROM completions c
       INNER JOIN habits h ON c.habit_id = h.id
       WHERE h.user_id = ?
       ORDER BY c.completed_date DESC`,
      [1]
    );

    res.json({ completions });
  } catch (error) {
    console.error('Get completions error:', error);
    res.status(500).json({ error: 'Failed to get completions' });
  }
};
