// Theme definitions for Habbit RPG

export const themes = {
  dark: {
    name: 'Dark Knight',
    colors: {
      bg: '#0f0f1e',
      bgDark: '#1a1a2e',
      accent: '#16213e',
      primary: '#ffd700',
      secondary: '#c0c0c0',
      text: '#ffffff',
      textMuted: '#9ca3af',
      border: '#ffd700',
      success: '#10b981',
      danger: '#ef4444',
    }
  },
  light: {
    name: 'Holy Paladin',
    colors: {
      bg: '#f5f5f5',
      bgDark: '#ffffff',
      accent: '#e5e7eb',
      primary: '#3b82f6',
      secondary: '#6b7280',
      text: '#1f2937',
      textMuted: '#6b7280',
      border: '#3b82f6',
      success: '#10b981',
      danger: '#ef4444',
    }
  },
  cappuccino: {
    name: 'Cappuccino Monk',
    colors: {
      bg: '#d4a574',
      bgDark: '#a67c52',
      accent: '#8b6f47',
      primary: '#4a3728',
      secondary: '#6d4c41',
      text: '#2d1810',
      textMuted: '#5d4037',
      border: '#4a3728',
      success: '#66bb6a',
      danger: '#e57373',
    }
  },
  forest: {
    name: 'Forest Ranger',
    colors: {
      bg: '#1a3a1a',
      bgDark: '#0d2b0d',
      accent: '#2d5016',
      primary: '#7cb342',
      secondary: '#558b2f',
      text: '#e8f5e9',
      textMuted: '#a5d6a7',
      border: '#7cb342',
      success: '#4caf50',
      danger: '#f44336',
    }
  },
  ocean: {
    name: 'Ocean Mage',
    colors: {
      bg: '#0a2463',
      bgDark: '#051441',
      accent: '#1e3a8a',
      primary: '#3bceac',
      secondary: '#0ead69',
      text: '#e0f2fe',
      textMuted: '#7dd3fc',
      border: '#3bceac',
      success: '#14b8a6',
      danger: '#f43f5e',
    }
  },
  sunset: {
    name: 'Sunset Warrior',
    colors: {
      bg: '#4a1c40',
      bgDark: '#2d0c28',
      accent: '#6b2d5c',
      primary: '#ff6b9d',
      secondary: '#c9379d',
      text: '#fce4ec',
      textMuted: '#f48fb1',
      border: '#ff6b9d',
      success: '#66bb6a',
      danger: '#ef5350',
    }
  },
  cyber: {
    name: 'Cyber Ninja',
    colors: {
      bg: '#0d1117',
      bgDark: '#010409',
      accent: '#161b22',
      primary: '#00ff41',
      secondary: '#00d9ff',
      text: '#c9d1d9',
      textMuted: '#8b949e',
      border: '#00ff41',
      success: '#00ff41',
      danger: '#ff0055',
    }
  },
  lava: {
    name: 'Lava Berserker',
    colors: {
      bg: '#1a0a00',
      bgDark: '#0d0500',
      accent: '#2d1508',
      primary: '#ff4500',
      secondary: '#ff6347',
      text: '#ffe4b5',
      textMuted: '#daa520',
      border: '#ff4500',
      success: '#ffa500',
      danger: '#dc143c',
    }
  },
  ice: {
    name: 'Ice Sorcerer',
    colors: {
      bg: '#1e3a5f',
      bgDark: '#0f1f3d',
      accent: '#2e4a6f',
      primary: '#b3e5fc',
      secondary: '#81d4fa',
      text: '#e1f5fe',
      textMuted: '#b3e5fc',
      border: '#b3e5fc',
      success: '#4dd0e1',
      danger: '#ff6b6b',
    }
  },
  royal: {
    name: 'Royal Guard',
    colors: {
      bg: '#1a0033',
      bgDark: '#0d001a',
      accent: '#2d004d',
      primary: '#9c27b0',
      secondary: '#ba68c8',
      text: '#f3e5f5',
      textMuted: '#ce93d8',
      border: '#9c27b0',
      success: '#66bb6a',
      danger: '#ef5350',
    }
  },
  desert: {
    name: 'Desert Nomad',
    colors: {
      bg: '#3e2723',
      bgDark: '#1c0f0a',
      accent: '#4e342e',
      primary: '#ffb74d',
      secondary: '#ff9800',
      text: '#fff3e0',
      textMuted: '#ffcc80',
      border: '#ffb74d',
      success: '#aed581',
      danger: '#e57373',
    }
  },
  toxic: {
    name: 'Toxic Alchemist',
    colors: {
      bg: '#1a2f1a',
      bgDark: '#0d1a0d',
      accent: '#1e3a1e',
      primary: '#76ff03',
      secondary: '#64dd17',
      text: '#f1f8e9',
      textMuted: '#aed581',
      border: '#76ff03',
      success: '#76ff03',
      danger: '#ff1744',
    }
  },
  sakura: {
    name: 'Sakura Samurai',
    colors: {
      bg: '#4a1a2c',
      bgDark: '#2d0a1a',
      accent: '#5c2236',
      primary: '#ffb3d9',
      secondary: '#ff80bf',
      text: '#fff0f5',
      textMuted: '#ffccee',
      border: '#ffb3d9',
      success: '#81c784',
      danger: '#e57373',
    }
  },
  gold: {
    name: 'Golden Emperor',
    colors: {
      bg: '#2d2100',
      bgDark: '#1a1400',
      accent: '#3d2f00',
      primary: '#ffd700',
      secondary: '#ffed4e',
      text: '#fffacd',
      textMuted: '#f0e68c',
      border: '#ffd700',
      success: '#9ccc65',
      danger: '#ef5350',
    }
  },
};

export const getTheme = () => {
  const saved = localStorage.getItem('habbit_theme');
  return saved || 'dark';
};

export const saveTheme = (themeName) => {
  localStorage.setItem('habbit_theme', themeName);
  applyTheme(themeName);
};

export const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.dark;
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

// Initialize theme on load
export const initializeTheme = () => {
  const currentTheme = getTheme();
  applyTheme(currentTheme);
};
