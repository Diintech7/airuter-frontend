// ThemeContext.js - Updated with better persistence
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Use a more reliable way to initialize the theme
  const [theme, setTheme] = useState('light'); // Default to light
  const [themeLoaded, setThemeLoaded] = useState(false);

  // First load - get theme from cookies
  useEffect(() => {
    const savedTheme = Cookies.get('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check if user prefers dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    setThemeLoaded(true);
  }, []);

  // Apply theme to document root element
  useEffect(() => {
    if (!themeLoaded) return;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference with 365 days expiry
    Cookies.set('theme', theme, { expires: 365 });
  }, [theme, themeLoaded]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Only render children once the theme has been determined
  if (!themeLoaded) {
    return <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
    </div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};