// LocalStorage utility functions for Habbit RPG

const STORAGE_KEYS = {
  CHARACTER: 'habbit_character',
  SKILLS: 'habbit_skills',
  HABITS: 'habbit_habits',
  HABIT_COMPLETIONS: 'habbit_completions',
};

// Character Management
export const getCharacter = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CHARACTER);
  return data ? JSON.parse(data) : {
    name: 'Hero',
    head: 0,
    chest: 0,
    legs: 0,
    weapon: 0,
    accessory: 0,
    totalXP: 0,
  };
};

export const saveCharacter = (character) => {
  localStorage.setItem(STORAGE_KEYS.CHARACTER, JSON.stringify(character));
};

// Skills Management
export const getSkills = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SKILLS);
  return data ? JSON.parse(data) : [];
};

export const saveSkills = (skills) => {
  localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
};

export const addSkill = (skill) => {
  const skills = getSkills();
  const newSkill = {
    id: Date.now().toString(),
    name: skill.name,
    level: 0,
    createdAt: new Date().toISOString(),
  };
  skills.push(newSkill);
  saveSkills(skills);
  return newSkill;
};

export const updateSkill = (id, updates) => {
  const skills = getSkills();
  const index = skills.findIndex(s => s.id === id);
  if (index !== -1) {
    skills[index] = { ...skills[index], ...updates };
    saveSkills(skills);
  }
};

export const deleteSkill = (id) => {
  const skills = getSkills().filter(s => s.id !== id);
  saveSkills(skills);
};

// Habits Management
export const getHabits = () => {
  const data = localStorage.getItem(STORAGE_KEYS.HABITS);
  return data ? JSON.parse(data) : [];
};

export const saveHabits = (habits) => {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
};

export const addHabit = (habit) => {
  const habits = getHabits();
  const newHabit = {
    id: Date.now().toString(),
    name: habit.name,
    skillId: habit.skillId,
    xp: 0,
    createdAt: new Date().toISOString(),
  };
  habits.push(newHabit);
  saveHabits(habits);
  return newHabit;
};

export const updateHabit = (id, updates) => {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === id);
  if (index !== -1) {
    habits[index] = { ...habits[index], ...updates };
    saveHabits(habits);
  }
};

export const deleteHabit = (id) => {
  const habits = getHabits().filter(h => h.id !== id);
  saveHabits(habits);
};

// Habit Completions Management
export const getCompletions = () => {
  const data = localStorage.getItem(STORAGE_KEYS.HABIT_COMPLETIONS);
  return data ? JSON.parse(data) : {};
};

export const saveCompletions = (completions) => {
  localStorage.setItem(STORAGE_KEYS.HABIT_COMPLETIONS, JSON.stringify(completions));
};

export const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

export const isCompletedToday = (habitId) => {
  const completions = getCompletions();
  const todayKey = getTodayKey();
  return completions[habitId]?.includes(todayKey) || false;
};

export const completeHabit = (habitId) => {
  const completions = getCompletions();
  const todayKey = getTodayKey();

  if (!completions[habitId]) {
    completions[habitId] = [];
  }

  if (!completions[habitId].includes(todayKey)) {
    completions[habitId].push(todayKey);
    saveCompletions(completions);

    // Increase habit XP
    const habits = getHabits();
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      habit.xp += 1;

      // Check if skill should level up (every 5 XP)
      if (habit.xp % 5 === 0 && habit.skillId) {
        const skills = getSkills();
        const skill = skills.find(s => s.id === habit.skillId);
        if (skill) {
          skill.level += 1;
          saveSkills(skills);
        }
      }

      saveHabits(habits);

      // Increase character total XP
      const character = getCharacter();
      character.totalXP += 1;
      saveCharacter(character);

      return true;
    }
  }

  return false;
};

export const uncompleteHabit = (habitId) => {
  const completions = getCompletions();
  const todayKey = getTodayKey();

  if (completions[habitId]) {
    completions[habitId] = completions[habitId].filter(date => date !== todayKey);
    saveCompletions(completions);
    return true;
  }

  return false;
};
