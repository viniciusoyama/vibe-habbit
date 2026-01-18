import React, { useState, useEffect } from 'react';
import { themes, getTheme, saveTheme } from '../utils/themes';

const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState(getTheme());
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    saveTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pixel-button-secondary text-xs flex items-center gap-2"
      >
        <span>🎨</span>
        <span className="hidden sm:inline">{themes[currentTheme]?.name || 'Theme'}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-theme-accent border-4 border-theme-border z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              <h3 className="text-theme-primary text-xs mb-2 px-2">Select Theme</h3>
              <div className="space-y-1">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      currentTheme === key
                        ? 'bg-theme-primary text-theme-bg-dark font-bold'
                        : 'bg-theme-bg-dark text-theme-text hover:bg-theme-bg'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{theme.name}</span>
                      {currentTheme === key && <span>✓</span>}
                    </div>
                    {/* Color preview */}
                    <div className="flex gap-1 mt-1">
                      <div
                        className="w-4 h-4 border border-black"
                        style={{ backgroundColor: theme.colors.bg }}
                      ></div>
                      <div
                        className="w-4 h-4 border border-black"
                        style={{ backgroundColor: theme.colors.primary }}
                      ></div>
                      <div
                        className="w-4 h-4 border border-black"
                        style={{ backgroundColor: theme.colors.secondary }}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
