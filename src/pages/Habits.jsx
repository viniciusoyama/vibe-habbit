import React, { useState, useEffect } from 'react';
import {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  getSkills,
  completeHabit,
  uncompleteHabit,
  isCompletedToday,
} from '../utils/storageAPI';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitSkillIds, setNewHabitSkillIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingSkillIds, setEditingSkillIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completionStates, setCompletionStates] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [habitsData, skillsData] = await Promise.all([
        getHabits(),
        getSkills()
      ]);
      setHabits(habitsData);
      setSkills(skillsData);

      // Load completion states for all habits
      const states = {};
      await Promise.all(
        habitsData.map(async (habit) => {
          states[habit.id] = await isCompletedToday(habit.id);
        })
      );
      setCompletionStates(states);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      try {
        setError(null);
        await addHabit({
          name: newHabitName.trim(),
          skillIds: newHabitSkillIds,
        });
        setNewHabitName('');
        setNewHabitSkillIds([]);
        await loadData();
      } catch (err) {
        setError('Failed to add habit. Please try again.');
        console.error('Error adding habit:', err);
      }
    }
  };

  const handleDeleteHabit = async (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        setError(null);
        await deleteHabit(id);
        await loadData();
      } catch (err) {
        setError('Failed to delete habit. Please try again.');
        console.error('Error deleting habit:', err);
      }
    }
  };

  const handleStartEdit = (habit) => {
    setEditingId(habit.id);
    setEditingName(habit.name);
    setEditingSkillIds(habit.skill_ids || []);
  };

  const handleSaveEdit = async (id) => {
    if (editingName.trim()) {
      try {
        setError(null);
        await updateHabit(id, {
          name: editingName.trim(),
          skillIds: editingSkillIds,
        });
        setEditingId(null);
        setEditingName('');
        setEditingSkillIds([]);
        await loadData();
      } catch (err) {
        setError('Failed to update habit. Please try again.');
        console.error('Error updating habit:', err);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingSkillIds([]);
  };

  const handleToggleCompletion = async (habitId) => {
    try {
      setError(null);
      const isCompleted = completionStates[habitId];
      if (isCompleted) {
        await uncompleteHabit(habitId);
      } else {
        await completeHabit(habitId);
      }
      await loadData();
    } catch (err) {
      setError('Failed to update completion. Please try again.');
      console.error('Error toggling completion:', err);
    }
  };

  const getSkillNames = (skillIds) => {
    if (!skillIds || skillIds.length === 0) return 'No skills';
    return skillIds
      .map(id => skills.find(s => s.id === id)?.name || 'Unknown')
      .join(', ');
  };

  const toggleSkillId = (skillId, currentIds, setIds) => {
    if (currentIds.includes(skillId)) {
      setIds(currentIds.filter(id => id !== skillId));
    } else {
      setIds([...currentIds, skillId]);
    }
  };

  const getNextLevelProgress = (xp) => {
    const currentLevel = Math.floor(xp / 5);
    const xpInCurrentLevel = xp % 5;
    return (xpInCurrentLevel / 5) * 100;
  };

  return (
    <div className="min-h-screen bg-theme-bg p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-theme-primary text-2xl mb-8 text-center">Habits</h1>

        {/* Error Message */}
        {error && (
          <div className="pixel-card mb-4 bg-red-900 border-red-700">
            <p className="text-white text-xs">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="pixel-card text-center py-8">
            <p className="text-theme-primary text-xs">Loading...</p>
          </div>
        ) : (
          <>
            {/* Add New Habit Form */}
            <div className="pixel-card mb-8">
          <h2 className="text-theme-primary text-sm mb-4">Add New Habit</h2>
          <form onSubmit={handleAddHabit} className="space-y-4">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Enter habit name..."
              className="pixel-input w-full"
            />
            <div>
              <label className="text-xs text-theme-text-muted block mb-2">Link to Skills (optional)</label>
              <div className="max-h-32 overflow-y-auto bg-theme-bg-dark border-4 border-theme-border p-2">
                {skills.length === 0 ? (
                  <p className="text-xs text-theme-text-muted">No skills available. Create skills first!</p>
                ) : (
                  skills.map((skill) => (
                    <label key={skill.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-theme-bg">
                      <input
                        type="checkbox"
                        checked={newHabitSkillIds.includes(skill.id)}
                        onChange={() => toggleSkillId(skill.id, newHabitSkillIds, setNewHabitSkillIds)}
                        className="w-4 h-4 accent-theme-primary"
                      />
                      <span className="text-xs text-theme-text">{skill.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <button type="submit" className="pixel-button w-full">
              Add Habit
            </button>
          </form>
        </div>

        {/* Habits List */}
        <div className="pixel-card">
          <h2 className="text-theme-primary text-sm mb-4">Your Habits</h2>
          {habits.length === 0 ? (
            <p className="text-xs text-theme-text-muted text-center py-8">
              No habits yet. Add your first habit above!
            </p>
          ) : (
            <div className="space-y-4">
              {habits.map((habit) => {
                const completed = completionStates[habit.id] || false;
                const progress = getNextLevelProgress(habit.xp);
                const nextLevelAt = Math.ceil(habit.xp / 5) * 5;

                return (
                  <div
                    key={habit.id}
                    className={`bg-theme-bg-dark border-4 p-4 ${
                      completed ? 'border-green-500' : 'border-theme-border'
                    }`}
                  >
                    {editingId === habit.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="pixel-input w-full"
                          autoFocus
                        />
                        <div>
                          <label className="text-xs text-theme-text-muted block mb-2">Link to Skills</label>
                          <div className="max-h-32 overflow-y-auto bg-theme-bg border-4 border-theme-border p-2">
                            {skills.length === 0 ? (
                              <p className="text-xs text-theme-text-muted">No skills available</p>
                            ) : (
                              skills.map((skill) => (
                                <label key={skill.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-theme-bg-dark">
                                  <input
                                    type="checkbox"
                                    checked={editingSkillIds.includes(skill.id)}
                                    onChange={() => toggleSkillId(skill.id, editingSkillIds, setEditingSkillIds)}
                                    className="w-4 h-4 accent-theme-primary"
                                  />
                                  <span className="text-xs text-theme-text">{skill.name}</span>
                                </label>
                              ))
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(habit.id)}
                            className="pixel-button flex-1"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="pixel-button-secondary flex-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-theme-primary text-sm mb-2">{habit.name}</h3>
                            <p className="text-xs text-theme-text-muted">
                              Skills: {getSkillNames(habit.skill_ids)}
                            </p>
                            <p className="text-xs text-theme-text-muted">
                              Total XP: {habit.xp} (Next skill level at {nextLevelAt} XP)
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleCompletion(habit.id)}
                              className={`${
                                completed
                                  ? 'bg-green-600 border-green-900'
                                  : 'bg-gray-600 border-gray-900'
                              } text-white px-3 py-2 border-4 text-xs hover:opacity-80`}
                            >
                              {completed ? '✓ Done' : 'Mark Done'}
                            </button>
                          </div>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="mb-4">
                          <div className="stat-bar">
                            <div
                              className="stat-bar-fill flex items-center justify-center text-xs font-bold"
                              style={{ width: `${progress}%` }}
                            >
                              {progress > 20 && (
                                <span className="text-white px-2">
                                  {habit.xp % 5}/5 XP
                                </span>
                              )}
                            </div>
                          </div>
                          {progress <= 20 && (
                            <p className="text-xs text-theme-text-muted mt-1">{habit.xp % 5}/5 XP to next skill level</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEdit(habit)}
                            className="pixel-button-secondary text-xs px-2 py-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteHabit(habit.id)}
                            className="bg-red-600 text-white px-2 py-1 border-4 border-red-900 text-xs hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </>
      )}
      </div>
    </div>
  );
};

export default Habits;
