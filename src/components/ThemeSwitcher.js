// src/components/ThemeSwitcher.js
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const { isDark, colors } = useThemeStyles();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white hover:text-white shadow-md shadow-purple-900/30' 
          : 'bg-purple-100 hover:bg-purple-200 active:bg-purple-300 text-purple-700 hover:text-purple-900 shadow-sm hover:shadow'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeSwitcher;