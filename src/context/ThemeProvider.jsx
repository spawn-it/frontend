'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { alpha } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        setIsDarkMode(JSON.parse(saved));
      } else {
        setIsDarkMode(
          window.matchMedia('(prefers-color-scheme: dark)').matches
        );
      }
    }
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }
  }, [isDarkMode, mounted]);

  const safeIsDarkMode = mounted ? isDarkMode : false;

  const theme = {
    isDarkMode: safeIsDarkMode,
    colors: {
      background: safeIsDarkMode ? '#121212' : '#f5f5f5',
      paper: safeIsDarkMode
        ? 'rgba(255,255,255,0.07)'
        : 'rgba(255,255,255,0.9)',
      paperHover: safeIsDarkMode
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(255,255,255,1)',
      text: safeIsDarkMode ? 'white' : '#1a1a1a',
      textSecondary: safeIsDarkMode
        ? 'rgba(255,255,255,0.7)'
        : 'rgba(0,0,0,0.7)',
      textMuted: safeIsDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      border: safeIsDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      navbar: safeIsDarkMode
        ? alpha('#0f2027', 0.85)
        : 'rgba(255,255,255,0.85)',
      navbarBorder: safeIsDarkMode
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(0,0,0,0.1)',
      inputBg: safeIsDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      inputBorder: safeIsDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
      inputBorderHover: safeIsDarkMode
        ? 'rgba(255,255,255,0.5)'
        : 'rgba(0,0,0,0.3)',
      chipBg: safeIsDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
      shadow: safeIsDarkMode
        ? '0 16px 30px rgba(0,0,0,0.4)'
        : '0 16px 30px rgba(0,0,0,0.15)',
    },
    toggleDarkMode: () => setIsDarkMode(prev => !prev),
    mounted,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
