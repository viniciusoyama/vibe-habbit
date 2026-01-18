import { get, all, run, transaction } from '../config/database.js';

// Get all skills for user
export const getSkills = async (req, res) => {
  try {
    const skills = await all(
      'SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC',
      [1]
    );

    res.json({ skills });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Failed to get skills' });
  }
};

// Create new skill
export const createSkill = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    const result = await run(
      'INSERT INTO skills (user_id, name) VALUES (?, ?)',
      [1, name.trim()]
    );

    const skill = await get(
      'SELECT * FROM skills WHERE id = ?',
      [result.lastInsertRowid]
    );

    res.status(201).json({
      message: 'Skill created successfully',
      skill
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
};

// Update skill
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level } = req.body;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push(`name = ?`);
      values.push(name.trim());
    }
    if (level !== undefined) {
      updates.push(`level = ?`);
      values.push(level);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(1, id);

    const result = await run(
      `UPDATE skills SET ${updates.join(', ')} WHERE user_id = ? AND id = ?`,
      values
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const skill = await get(
      'SELECT * FROM skills WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Skill updated successfully',
      skill
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
};

// Delete skill
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await get(
      'SELECT * FROM skills WHERE user_id = ? AND id = ?',
      [1, id]
    );

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    await run(
      'DELETE FROM skills WHERE user_id = ? AND id = ?',
      [1, id]
    );

    res.json({
      message: 'Skill deleted successfully',
      skill
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
};
