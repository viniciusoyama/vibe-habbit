import React, { useState, useEffect } from 'react';
import CharacterSprite from '../components/Character';
import { getCharacter, getSkills, getHabits } from '../utils/storageAPI';

const Dashboard = () => {
  const [character, setCharacter] = useState(null);
  const [skills, setSkills] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [charData, skillsData, habitsData] = await Promise.all([
        getCharacter(),
        getSkills(),
        getHabits()
      ]);
      setCharacter(charData);
      setSkills(skillsData);
      setHabits(habitsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
        <p className="text-theme-primary text-sm">Loading...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
        <p className="text-theme-danger text-sm">Failed to load character data</p>
      </div>
    );
  }

  const getTotalSkillLevels = () => {
    return skills.reduce((sum, skill) => sum + skill.level, 0);
  };

  const getAverageSkillLevel = () => {
    if (skills.length === 0) return 0;
    return (getTotalSkillLevels() / skills.length).toFixed(1);
  };

  const getTotalHabitXP = () => {
    return habits.reduce((sum, habit) => sum + habit.xp, 0);
  };

  return (
    <div className="min-h-screen bg-theme-bg p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-theme-primary text-2xl mb-8 text-center">Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Character Card */}
          <div className="pixel-card">
            <h2 className="text-theme-primary text-sm mb-4 text-center">Your Hero</h2>
            <div className="bg-theme-bg-dark border-4 border-theme-border p-4">
              <CharacterSprite {...character} />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-theme-primary text-lg">{character.name}</h3>
              <p className="text-sm text-theme-text-muted mt-2">Total XP: {character.total_xp}</p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="pixel-card">
            <h2 className="text-theme-primary text-sm mb-4">Overall Stats</h2>
            <div className="space-y-4">
              <div className="bg-theme-bg-dark border-2 border-theme-border p-4">
                <p className="text-xs text-theme-text-muted">Total Skills</p>
                <p className="text-2xl text-theme-primary">{skills.length}</p>
              </div>
              <div className="bg-theme-bg-dark border-2 border-theme-border p-4">
                <p className="text-xs text-theme-text-muted">Total Skill Levels</p>
                <p className="text-2xl text-theme-primary">{getTotalSkillLevels()}</p>
              </div>
              <div className="bg-theme-bg-dark border-2 border-theme-border p-4">
                <p className="text-xs text-theme-text-muted">Average Skill Level</p>
                <p className="text-2xl text-theme-primary">{getAverageSkillLevel()}</p>
              </div>
              <div className="bg-theme-bg-dark border-2 border-theme-border p-4">
                <p className="text-xs text-theme-text-muted">Total Habits</p>
                <p className="text-2xl text-theme-primary">{habits.length}</p>
              </div>
              <div className="bg-theme-bg-dark border-2 border-theme-border p-4">
                <p className="text-xs text-theme-text-muted">Total Habit XP</p>
                <p className="text-2xl text-theme-primary">{getTotalHabitXP()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="pixel-card mb-8">
          <h2 className="text-theme-primary text-sm mb-4">Skill Levels</h2>
          {skills.length === 0 ? (
            <p className="text-xs text-theme-text-muted text-center py-8">
              No skills yet. Create some skills to track your progress!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-theme-bg-dark border-4 border-theme-border p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-theme-primary text-sm">{skill.name}</h3>
                    <span className="text-xs bg-theme-primary text-theme-bg-dark px-2 py-1 font-bold">
                      Lv {skill.level}
                    </span>
                  </div>
                  <div className="stat-bar">
                    <div
                      className="stat-bar-fill"
                      style={{ width: `${Math.min((skill.level / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-theme-text-muted mt-2">
                    {habits.filter((h) => h.skill_id === skill.id).length} habit(s) linked
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Habits Summary */}
        <div className="pixel-card">
          <h2 className="text-theme-primary text-sm mb-4">Active Habits</h2>
          {habits.length === 0 ? (
            <p className="text-xs text-theme-text-muted text-center py-8">
              No habits yet. Create some habits to start leveling up!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {habits.map((habit) => {
                const skill = skills.find((s) => s.id === habit.skill_id);
                return (
                  <div key={habit.id} className="bg-theme-bg-dark border-4 border-theme-border p-4">
                    <h3 className="text-theme-primary text-sm mb-2">{habit.name}</h3>
                    <p className="text-xs text-theme-text-muted mb-2">
                      Linked to: {skill ? skill.name : 'No skill'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">XP: {habit.xp}</span>
                      <span className="text-xs">
                        Next skill level: {Math.ceil(habit.xp / 5) * 5} XP
                      </span>
                    </div>
                    <div className="stat-bar mt-2">
                      <div
                        className="stat-bar-fill"
                        style={{ width: `${((habit.xp % 5) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
