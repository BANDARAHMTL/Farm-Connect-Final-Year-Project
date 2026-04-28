import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme-mode');
    if (saved) {
      return saved === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update localStorage and document class when theme changes
  useEffect(() => {
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    const root = document.documentElement;
    const body = document.body;
    
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    } else {
      root.setAttribute('data-theme', 'light');
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
