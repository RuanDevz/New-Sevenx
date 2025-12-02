import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface MonthFilterProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  themeColor?: 'purple' | 'orange' | 'yellow' | 'red' | 'slate';
}

const months = [
  { value: "", label: "All Months" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const MonthFilter: React.FC<MonthFilterProps> = ({ 
  selectedMonth, 
  onMonthChange, 
  themeColor = 'purple' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getThemeClasses = () => {
    const baseClasses = {
      purple: {
        button: isDark 
          ? 'bg-gray-700/50 hover:bg-purple-500/20 text-gray-300 hover:text-purple-300 border-gray-600/50'
          : 'bg-gray-200/50 hover:bg-purple-100 text-gray-700 hover:text-purple-700 border-gray-300/50',
        dropdown: isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200',
        item: isDark
          ? 'hover:bg-purple-500/20 text-gray-300 hover:text-purple-300'
          : 'hover:bg-purple-100 text-gray-700 hover:text-purple-700'
      },
      orange: {
        button: isDark 
          ? 'bg-gray-700/50 hover:bg-orange-500/20 text-gray-300 hover:text-orange-300 border-gray-600/50'
          : 'bg-gray-200/50 hover:bg-orange-100 text-gray-700 hover:text-orange-700 border-gray-300/50',
        dropdown: isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200',
        item: isDark
          ? 'hover:bg-orange-500/20 text-gray-300 hover:text-orange-300'
          : 'hover:bg-orange-100 text-gray-700 hover:text-orange-700'
      },
      yellow: {
        button: isDark 
          ? 'bg-gray-700/50 hover:bg-yellow-500/20 text-gray-300 hover:text-yellow-300 '
          : 'bg-gray-200/50 hover:bg-yellow-100 text-gray-700 hover:text-yellow-700 ',
        dropdown: isDark
          ? 'bg-gray-800 '
          : 'bg-white ',
        item: isDark
          ? 'hover:bg-yellow-500/20 text-gray-300 hover:text-yellow-300'
          : 'hover:bg-yellow-100 text-gray-700 hover:text-yellow-700'
      },
      red: {
        button: isDark 
          ? 'bg-gray-700/50 hover:bg-red-500/20 text-gray-300 hover:text-red-300 border-gray-600/50'
          : 'bg-gray-200/50 hover:bg-red-100 text-gray-700 hover:text-red-700 border-gray-300/50',
        dropdown: isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200',
        item: isDark
          ? 'hover:bg-red-500/20 text-gray-300 hover:text-red-300'
          : 'hover:bg-red-100 text-gray-700 hover:text-red-700'
      },
      slate: {
        button: isDark 
          ? 'bg-gray-700/50 hover:bg-slate-500/20 text-gray-300 hover:text-slate-300 border-gray-600/50'
          : 'bg-gray-200/50 hover:bg-slate-100 text-gray-700 hover:text-slate-700 border-gray-300/50',
        dropdown: isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200',
        item: isDark
          ? 'hover:bg-slate-500/20 text-gray-300 hover:text-slate-300'
          : 'hover:bg-slate-100 text-gray-700 hover:text-slate-700'
      }
    };
    return baseClasses[themeColor];
  };

  const themeClasses = getThemeClasses();
  const selectedMonthLabel = months.find(m => m.value === selectedMonth)?.label || "All Months";

  return (
    <div className="relative z-[9999]">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300  ${themeClasses.button} z-[9999]`}
      >
        <Calendar className="w-4 h-4" />
        <span className="text-xs font-medium min-w-[80px] text-left">{selectedMonthLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
           className={`absolute top-full mt-2 right-0 w-48 rounded-xl shadow-xl  backdrop-blur-xl z-[11000] ${themeClasses.dropdown}`}

          >
            <div className="p-2 max-h-64 overflow-y-auto z-[9999]">
              {months.map((month) => (
                <motion.button
                  key={month.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onMonthChange(month.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedMonth === month.value
                      ? isDark
                        ? themeClasses.item
                        : themeClasses.item
                      : themeClasses.item
                  }`}
                >
                  {month.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MonthFilter;