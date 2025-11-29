import React, { createContext, useContext, useEffect, useState } from 'react';
import themeData from '../config/theme.json';

const ThemeContext = createContext(themeData);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themeData);

  useEffect(() => {
    // Set CSS variables on :root
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--secondary', theme.secondary);
      root.style.setProperty('--background', theme.background);
      root.style.setProperty('--text', theme.text);
      if (theme.accents) {
        Object.entries(theme.accents).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
