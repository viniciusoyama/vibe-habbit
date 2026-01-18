import React, { useState, useEffect } from 'react';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../utils/storageAPI';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingLevel, setEditingLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      setError('Failed to load skills. Please try again.');
      console.error('Error loading skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (newSkillName.trim()) {
      try {
        setError(null);
        await addSkill({ name: newSkillName.trim(), level: newSkillLevel });
        setNewSkillName('');
        setNewSkillLevel(0);
        await loadSkills();
      } catch (err) {
        setError('Failed to add skill. Please try again.');
        console.error('Error adding skill:', err);
      }
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        setError(null);
        await deleteSkill(id);
        await loadSkills();
      } catch (err) {
        setError('Failed to delete skill. Please try again.');
        console.error('Error deleting skill:', err);
      }
    }
  };

  const handleStartEdit = (skill) => {
    setEditingId(skill.id);
    setEditingName(skill.name);
    setEditingLevel(skill.level);
  };

  const handleSaveEdit = async (id) => {
    if (editingName.trim()) {
      try {
        setError(null);
        await updateSkill(id, { name: editingName.trim(), level: editingLevel });
        setEditingId(null);
        setEditingName('');
        setEditingLevel(0);
        await loadSkills();
      } catch (err) {
        setError('Failed to update skill. Please try again.');
        console.error('Error updating skill:', err);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingLevel(0);
  };

  return (
    <div className="min-h-screen bg-theme-bg p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-theme-primary text-2xl mb-8 text-center">Skills</h1>

        {/* Error Message */}
        {error && (
          <div className="pixel-card mb-8 bg-red-100 border-red-600">
            <p className="text-red-600 text-xs text-center">{error}</p>
          </div>
        )}

        {/* Add New Skill Form */}
        <div className="pixel-card mb-8">
          <h2 className="text-theme-primary text-sm mb-4">Add New Skill</h2>
          <form onSubmit={handleAddSkill} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-xs text-theme-text-muted block mb-1">Name</label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Enter skill name..."
                className="pixel-input w-full"
                disabled={loading}
              />
            </div>
            <div className="w-24">
              <label className="text-xs text-theme-text-muted block mb-1">Level</label>
              <input
                type="number"
                min="0"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Math.max(0, parseInt(e.target.value) || 0))}
                className="pixel-input w-full text-center"
                disabled={loading}
              />
            </div>
            <button type="submit" className="pixel-button" disabled={loading}>
              Add
            </button>
          </form>
        </div>

        {/* Skills List */}
        <div className="pixel-card">
          <h2 className="text-theme-primary text-sm mb-4">Your Skills</h2>
          {loading ? (
            <p className="text-xs text-theme-text-muted text-center py-8">
              Loading skills...
            </p>
          ) : skills.length === 0 ? (
            <p className="text-xs text-theme-text-muted text-center py-8">
              No skills yet. Add your first skill above!
            </p>
          ) : (
            <div className="space-y-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-theme-bg-dark border-4 border-theme-border p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    {editingId === skill.id ? (
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="text-xs text-theme-text-muted block mb-1">Name</label>
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="pixel-input w-full"
                            autoFocus
                          />
                        </div>
                        <div className="w-20">
                          <label className="text-xs text-theme-text-muted block mb-1">Level</label>
                          <input
                            type="number"
                            min="0"
                            value={editingLevel}
                            onChange={(e) => setEditingLevel(Math.max(0, parseInt(e.target.value) || 0))}
                            className="pixel-input w-full text-center"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-theme-primary text-sm mb-2">{skill.name}</h3>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="stat-bar">
                              <div
                                className="stat-bar-fill flex items-center justify-center text-xs font-bold"
                                style={{ width: `${Math.min((skill.level / 10) * 100, 100)}%` }}
                              >
                                {skill.level > 0 && <span className="text-white px-2">Lv {skill.level}</span>}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-theme-primary min-w-[60px] text-right">
                            Level {skill.level}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="ml-4 flex gap-2">
                    {editingId === skill.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(skill.id)}
                          className="pixel-button text-xs px-2 py-1"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="pixel-button-secondary text-xs px-2 py-1"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(skill)}
                          className="pixel-button-secondary text-xs px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="bg-red-600 text-white px-2 py-1 border-4 border-red-900 text-xs hover:bg-red-500"
                        >
                          Del
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;
