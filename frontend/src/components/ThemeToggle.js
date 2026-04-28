import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        background: isDark ? '#1c3a2a' : '#f0f5f2',
        border: `1.5px solid ${isDark ? '#4a6358' : '#c3d6cc'}`,
        color: isDark ? '#86d9a3' : '#2e4438',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: '1.1rem',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        minWidth: 40,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isDark ? '#2e4c38' : '#e8f5eb';
        e.currentTarget.style.borderColor = isDark ? '#6b8577' : '#27a85c';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isDark ? '#1c3a2a' : '#f0f5f2';
        e.currentTarget.style.borderColor = isDark ? '#4a6358' : '#c3d6cc';
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
