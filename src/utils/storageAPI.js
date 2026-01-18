// API-based storage utilities for Habbit RPG
import { characterAPI, skillsAPI, habitsAPI } from './api';

// Character Management
export const getCharacter = async () => {
  try {
    const response = await characterAPI.get();
    return response.character;
  } catch (error) {
    console.error('Error getting character:', error);
    throw error;
  }
};

export const saveCharacter = async (updates) => {
  try {
    const response = await characterAPI.update(updates);
    return response.character;
  } catch (error) {
    console.error('Error saving character:', error);
    throw error;
  }
};

// Skills Management
export const getSkills = async () => {
  try {
    const response = await skillsAPI.getAll();
    return response.skills;
  } catch (error) {
    console.error('Error getting skills:', error);
    throw error;
  }
};

export const addSkill = async (skill) => {
  try {
    const response = await skillsAPI.create(skill.name);
    return response.skill;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};

export const updateSkill = async (id, updates) => {
  try {
    const response = await skillsAPI.update(id, updates);
    return response.skill;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

export const deleteSkill = async (id) => {
  try {
    const response = await skillsAPI.delete(id);
    return response.skill;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

// Habits Management
export const getHabits = async () => {
  try {
    const response = await habitsAPI.getAll();
    return response.habits;
  } catch (error) {
    console.error('Error getting habits:', error);
    throw error;
  }
};

export const addHabit = async (habit) => {
  try {
    const response = await habitsAPI.create(habit.name, habit.skillId);
    return response.habit;
  } catch (error) {
    console.error('Error adding habit:', error);
    throw error;
  }
};

export const updateHabit = async (id, updates) => {
  try {
    const response = await habitsAPI.update(id, updates);
    return response.habit;
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

export const deleteHabit = async (id) => {
  try {
    const response = await habitsAPI.delete(id);
    return response.habit;
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
};

// Habit Completions Management
export const getCompletions = async () => {
  try {
    const response = await habitsAPI.getCompletions();
    // Transform API response to match localStorage format
    const completionsMap = {};
    response.completions.forEach(completion => {
      if (!completionsMap[completion.habit_id]) {
        completionsMap[completion.habit_id] = [];
      }
      completionsMap[completion.habit_id].push(completion.completed_date);
    });
    return completionsMap;
  } catch (error) {
    console.error('Error getting completions:', error);
    throw error;
  }
};

export const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

export const isCompletedToday = async (habitId) => {
  try {
    const completions = await getCompletions();
    const todayKey = getTodayKey();
    return completions[habitId]?.includes(todayKey) || false;
  } catch (error) {
    console.error('Error checking completion:', error);
    return false;
  }
};

export const completeHabit = async (habitId) => {
  try {
    await habitsAPI.complete(habitId);
    return true;
  } catch (error) {
    console.error('Error completing habit:', error);
    if (error.message.includes('already completed')) {
      return false;
    }
    throw error;
  }
};

export const uncompleteHabit = async (habitId) => {
  try {
    await habitsAPI.uncomplete(habitId);
    return true;
  } catch (error) {
    console.error('Error uncompleting habit:', error);
    if (error.message.includes('not completed')) {
      return false;
    }
    throw error;
  }
};
