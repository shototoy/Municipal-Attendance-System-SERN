import { createContext, useContext } from 'react';
import theme from '../config/theme.json';

const ThemeContext = createContext(theme);

export function ThemeProvider({ children, value }) {
  // allow override via value, default to imported theme
  return (
    <ThemeContext.Provider value={value || theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const t = useContext(ThemeContext);
  const get = (path, fallback = '') => {
    const parts = path.split('.');
    let cur = t;
    for (const p of parts) {
      if (!cur || typeof cur !== 'object' || !(p in cur)) return fallback;
      cur = cur[p];
    }
    return typeof cur === 'string' ? cur : fallback;
  };
  return { theme: t, get };
}
