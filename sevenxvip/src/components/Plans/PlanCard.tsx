import React, { useState } from "react";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

interface PlanCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  onButtonClick: () => Promise<void>;
  isPopular: boolean;
  unPopular?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  price,
  description,
  features,
  buttonText,
  onButtonClick,
  isPopular,
  unPopular,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleButtonClick = async () => {
    setIsLoading(true);
    try {
      await onButtonClick();
    } catch (error) {
      console.error("Error during button click:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative backdrop-blur-xl border rounded-3xl p-8 w-80 h-auto overflow-hidden shadow-2xl transition-all duration-500 ${
        isDark 
          ? 'bg-gray-800/60 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      } ${
        isPopular 
          ? isDark 
            ? "border-yellow-500/50 shadow-yellow-500/20" 
            : "border-yellow-400/60 shadow-yellow-400/20"
          : unPopular 
            ? isDark
              ? "border-gray-600/50 shadow-gray-500/10"
              : "border-gray-300/60 shadow-gray-300/10"
            : isDark
              ? "border-purple-500/50 shadow-purple-500/20"
              : "border-purple-400/60 shadow-purple-400/20"
      }`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        isPopular 
          ? "bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-600/20"
          : unPopular
          ? "bg-gradient-to-br from-gray-500/10 via-transparent to-gray-600/20"
          : "bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/20"
      }`}></div>

      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Crown className="w-3 h-3" />
          POPULAR
        </div>
      )}
      
      <div className="relative z-10 text-center">
        {/* Icon */}
        <div className="mb-6">
          {!unPopular && (
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-xl ${
              isPopular 
                ? "bg-gradient-to-br from-yellow-400 to-yellow-500"
                : "bg-gradient-to-br from-purple-500 to-purple-600"
            }`}>
              <Crown className="w-8 h-8 text-white" />
            </div>
          )}
          {unPopular && (
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-xl">
              <i className="fa-solid fa-gift text-white text-2xl"></i>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold mb-2 font-orbitron ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h2>
        
        {/* Description */}
        <p className={`text-sm mb-6 font-roboto ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {description}
        </p>
        
        {/* Price */}
        <div className="mb-8">
          <span className={`text-4xl font-bold font-orbitron ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {price}
          </span>
          {price !== "$0.00" && (
            <span className={`text-sm font-roboto ml-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>/month</span>
          )}
        </div>

        {/* Features */}
        <ul className="mb-8 space-y-3 text-left">
          {features.map((feature, index) => {
            const isFeatureDenied = unPopular && index > 3;
            return (
              <li
                key={index}
                className={`flex items-center gap-3 text-sm font-roboto ${
                  isFeatureDenied ? "opacity-50 line-through" : ""
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isFeatureDenied 
                    ? "bg-red-500/20" 
                    : "bg-green-500/20"
                }`}>
                  <i className={`fa-solid ${
                    isFeatureDenied ? 'fa-times text-red-400' : 'fa-check text-green-400'
                  } text-xs`}></i>
                </div>
                <span className={`${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {feature}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleButtonClick}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 font-orbitron ${
            isLoading
              ? "opacity-75 cursor-not-allowed bg-gray-600"
              : isPopular
              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black shadow-lg hover:shadow-yellow-500/30"
              : unPopular
              ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-gray-500/30"
              : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-500/30"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              {!unPopular && <Crown className="w-5 h-5" />}
              {unPopular && <i className="fa-solid fa-gift"></i>}
              <span>{buttonText}</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PlanCard;