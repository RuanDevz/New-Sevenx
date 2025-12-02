import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../ThemeToggle";

const Chooser: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleChoice = (type: 'asian' | 'western') => {
    navigate(`/${type}`);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Background Effects */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900'
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/30 via-white to-gray-50'
      }`}></div>
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
        isDark ? 'bg-purple-500/10' : 'bg-purple-200/30'
      }`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
        isDark ? 'bg-orange-500/10' : 'bg-orange-200/30'
      }`}></div>
      

      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10"
      >
        {/* Main Logo */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12"
        >
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-['Orbitron'] tracking-wider ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            SEVENXLEAKS
          </h1>
          <div className={`w-32 h-1 mx-auto rounded-full shadow-lg ${
            isDark 
              ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-purple-500/30'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 shadow-purple-500/20'
          }`}></div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={`text-xl sm:text-2xl mb-16 font-['Roboto'] font-light ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Choose Your Experience
        </motion.p>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          {/* Asian Choice */}
          <motion.div
            className="group relative cursor-pointer"
            onClick={() => handleChoice('asian')}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className={`relative backdrop-blur-xl border rounded-3xl p-6 sm:p-10 w-72 sm:w-80 h-56 sm:h-72 overflow-hidden shadow-2xl transition-all duration-500 ${
              isDark 
                ? 'bg-gray-800/70 border-gray-700/50 group-hover:shadow-purple-500/20' 
                : 'bg-white/80 border-gray-200/50 group-hover:shadow-purple-500/10'
            }`}>
              {/* Background Gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/20'
                  : 'bg-gradient-to-br from-purple-200/30 via-transparent to-purple-300/40'
              }`}></div>
              
              {/* Glow Effect */}
              <div className={`absolute -top-10 sm:-top-20 -left-10 sm:-left-20 w-32 sm:w-40 h-32 sm:h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark ? 'bg-purple-500/20' : 'bg-purple-300/40'
              }`}></div>
              
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                <div className="mb-4 sm:mb-8">
                 
                </div>
                
                <h2 className={`text-lg sm:text-2xl font-bold mb-2 sm:mb-4 font-orbitron ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  SEVENXLEAKS <span className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300 block text-base sm:text-xl mt-1">ASIAN</span>
                </h2>
                <p className={`transition-colors duration-300 font-roboto text-sm sm:text-base px-2 ${
                  isDark 
                    ? 'text-gray-400 group-hover:text-gray-300' 
                    : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  Enter the world of Asian content
                </p>
                
                {/* Hover Border */}
                <div className={`absolute inset-0 border-2 border-transparent rounded-3xl transition-all duration-500 ${
                  isDark 
                    ? 'group-hover:border-purple-500/50' 
                    : 'group-hover:border-purple-400/60'
                }`}></div>
              </div>
            </div>
          </motion.div>
          
          {/* Western Choice */}
          <motion.div
            className="group relative cursor-pointer"
            onClick={() => handleChoice('western')}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className={`relative backdrop-blur-xl border rounded-3xl p-6 sm:p-10 w-72 sm:w-80 h-56 sm:h-72 overflow-hidden shadow-2xl transition-all duration-500 ${
              isDark 
                ? 'bg-gray-800/70 border-gray-700/50 group-hover:shadow-orange-500/20' 
                : 'bg-white/80 border-gray-200/50 group-hover:shadow-orange-500/10'
            }`}>
              {/* Background Gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-orange-500/10 via-transparent to-orange-600/20'
                  : 'bg-gradient-to-br from-orange-200/30 via-transparent to-orange-300/40'
              }`}></div>
              
              {/* Glow Effect */}
              <div className={`absolute -bottom-10 sm:-bottom-20 -right-10 sm:-right-20 w-32 sm:w-40 h-32 sm:h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark ? 'bg-orange-500/20' : 'bg-orange-300/40'
              }`}></div>
              
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                <div className="mb-4 sm:mb-8">
                 
                </div>
                
                <h2 className={`text-lg sm:text-2xl font-bold mb-2 sm:mb-4 font-orbitron ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  SEVENXLEAKS <span className="text-orange-400 group-hover:text-orange-300 transition-colors duration-300 block text-base sm:text-xl mt-1">WESTERN</span>
                </h2>
                <p className={`transition-colors duration-300 font-roboto text-sm sm:text-base px-2 ${
                  isDark 
                    ? 'text-gray-400 group-hover:text-gray-300' 
                    : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  Explore our Western collection
                </p>
                
                {/* Hover Border */}
                <div className={`absolute inset-0 border-2 border-transparent rounded-3xl transition-all duration-500 ${
                  isDark 
                    ? 'group-hover:border-orange-500/50' 
                    : 'group-hover:border-orange-400/60'
                }`}></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className={`text-sm sm:text-base font-roboto px-4 ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Select your preferred content category to continue
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Chooser;