import { get, run } from '../config/database.js';

// Get user's character
export const getCharacter = async (req, res) => {
  try {
    const userId = 1; // Hardcoded default user
    const character = get(
      'SELECT * FROM characters WHERE user_id = ?',
      [userId]
    );

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json({ character });
  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({ error: 'Failed to get character' });
  }
};

// Update character
export const updateCharacter = async (req, res) => {
  try {
    const userId = 1; // Hardcoded default user
    const { name, head, chest, legs, weapon, accessory } = req.body;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (head !== undefined) {
      updates.push('head = ?');
      values.push(head);
    }
    if (chest !== undefined) {
      updates.push('chest = ?');
      values.push(chest);
    }
    if (legs !== undefined) {
      updates.push('legs = ?');
      values.push(legs);
    }
    if (weapon !== undefined) {
      updates.push('weapon = ?');
      values.push(weapon);
    }
    if (accessory !== undefined) {
      updates.push('accessory = ?');
      values.push(accessory);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    run(
      `UPDATE characters SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    const character = get('SELECT * FROM characters WHERE user_id = ?', [userId]);

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json({
      message: 'Character updated successfully',
      character
    });
  } catch (error) {
    console.error('Update character error:', error);
    res.status(500).json({ error: 'Failed to update character' });
  }
};
