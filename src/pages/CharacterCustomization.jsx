import React, { useState, useEffect } from 'react';
import CharacterSprite from '../components/Character';
import { getCharacter, saveCharacter } from '../utils/storageAPI';

const CharacterCustomization = () => {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCharacter();
      setCharacter(data);
    } catch (err) {
      setError('Failed to load character');
      console.error('Error loading character:', err);
    } finally {
      setLoading(false);
    }
  };

  const updatePart = async (part, value) => {
    try {
      setError(null);
      const updates = { [part]: value };
      const updatedCharacter = await saveCharacter(updates);
      setCharacter(updatedCharacter);
    } catch (err) {
      setError('Failed to update character');
      console.error('Error updating character:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg p-4 flex items-center justify-center">
        <p className="text-theme-primary">Loading character...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-theme-bg p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={loadCharacter} className="pixel-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-theme-bg p-4 flex items-center justify-center">
        <p className="text-theme-primary">No character data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-theme-primary text-2xl mb-8 text-center">Character Customization</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Character Preview */}
          <div className="pixel-card">
            <h2 className="text-theme-primary text-sm mb-4 text-center">Preview</h2>
            <div className="bg-theme-bg-dark p-4 border-4 border-theme-border">
              <CharacterSprite {...character} />
            </div>
            <div className="mt-4 text-center">
              <input
                type="text"
                value={character.name}
                onChange={(e) => updatePart('name', e.target.value)}
                className="pixel-input w-full text-center"
                placeholder="Hero Name"
              />
            </div>
            <div className="mt-4 text-center text-xs">
              <p className="text-theme-primary">Total XP: {character.total_xp}</p>
            </div>
          </div>

          {/* Customization Options */}
          <div className="pixel-card">
            <h2 className="text-theme-primary text-sm mb-4">Customize Parts</h2>

            <div className="space-y-4">
              {/* Head */}
              <div>
                <label className="block text-xs text-theme-primary mb-2">Head Style</label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={character.head}
                  onChange={(e) => updatePart('head', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs mt-1">Style {character.head + 1}</p>
              </div>

              {/* Chest */}
              <div>
                <label className="block text-xs text-theme-primary mb-2">Chest Armor</label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={character.chest}
                  onChange={(e) => updatePart('chest', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs mt-1">Style {character.chest + 1}</p>
              </div>

              {/* Legs */}
              <div>
                <label className="block text-xs text-theme-primary mb-2">Leg Armor</label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={character.legs}
                  onChange={(e) => updatePart('legs', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs mt-1">Style {character.legs + 1}</p>
              </div>

              {/* Weapon */}
              <div>
                <label className="block text-xs text-theme-primary mb-2">Weapon</label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={character.weapon}
                  onChange={(e) => updatePart('weapon', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs mt-1">{character.weapon === 0 ? 'None' : `Weapon ${character.weapon}`}</p>
              </div>

              {/* Accessory */}
              <div>
                <label className="block text-xs text-theme-primary mb-2">Accessory</label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={character.accessory}
                  onChange={(e) => updatePart('accessory', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs mt-1">{character.accessory === 0 ? 'None' : `Accessory ${character.accessory}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomization;
