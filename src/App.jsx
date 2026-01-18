import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import Habits from './pages/Habits';
import CharacterCustomization from './pages/CharacterCustomization';
import ThemeSelector from './components/ThemeSelector';
import { initializeTheme } from './utils/themes';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-theme-accent border-b-4 border-theme-border p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-theme-primary text-xl">Vibe Habbit RPG</h1>
          <div className="flex items-center gap-2">
            <ThemeSelector />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className={`${
              isActive('/') ? 'pixel-button' : 'pixel-button-secondary'
            } text-xs`}
          >
            Dashboard
          </Link>
          <Link
            to="/skills"
            className={`${
              isActive('/skills') ? 'pixel-button' : 'pixel-button-secondary'
            } text-xs`}
          >
            Skills
          </Link>
          <Link
            to="/habits"
            className={`${
              isActive('/habits') ? 'pixel-button' : 'pixel-button-secondary'
            } text-xs`}
          >
            Habits
          </Link>
          <Link
            to="/character"
            className={`${
              isActive('/character') ? 'pixel-button' : 'pixel-button-secondary'
            } text-xs`}
          >
            Character
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-theme-bg text-theme-text">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/character" element={<CharacterCustomization />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
