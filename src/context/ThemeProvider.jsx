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
  // Récupérer la préférence sauvegardée ou utiliser la préférence système
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Sauvegarder la préférence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }
  }, [isDarkMode]);

  // Générer le thème basé sur le mode
  const theme = {
    isDarkMode,
    colors: {
      background: isDarkMode ? '#121212' : '#f5f5f5',
      paper: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.9)',
      paperHover: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,1)',
      text: isDarkMode ? 'white' : '#1a1a1a',
      textSecondary: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      textMuted: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      navbar: isDarkMode ? alpha('#0f2027', 0.85) : 'rgba(255,255,255,0.85)',
      navbarBorder: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      inputBg: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      inputBorder: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
      inputBorderHover: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
      chipBg: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
      shadow: isDarkMode ? '0 16px 30px rgba(0,0,0,0.4)' : '0 16px 30px rgba(0,0,0,0.15)',
    },
    toggleDarkMode: () => setIsDarkMode(prev => !prev),
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};