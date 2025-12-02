import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 sm:p-3 transition-all duration-300 group border backdrop-blur-sm shadow-lg hover:shadow-xl rounded-xl ${
        isDark 
          ? 'text-gray-300 hover:text-white hover:bg-gray-700/50 border-gray-700/40 hover:border-gray-600/60' 
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 border-gray-300/40 hover:border-gray-400/60'
      }`}
      title="Toggle Theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <div className="relative">
        <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} text-sm sm:text-lg transition-all duration-300 group-hover:rotate-12 ${
          isDark ? 'text-yellow-400' : 'text-indigo-600'
        }`}></i>
        <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm animate-pulse ${
          isDark ? 'bg-yellow-400/20' : 'bg-indigo-600/20'
        }`}></div>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;