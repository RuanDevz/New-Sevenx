import React from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

interface AdminFilterBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  activeTab: "asian" | "western" | "vip" | "banned" | "unknown";
  setActiveTab: React.Dispatch<React.SetStateAction<"asian" | "western" | "vip" | "banned" | "unknown">>;
  categories: string[];
}

const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  activeTab,
  setActiveTab,
  categories,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>
      </div>
      
      <div className="flex gap-3">
        <div className="relative">
          <Filter
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`pl-10 pr-8 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[150px] transition-colors ${
              isDark
                ? "bg-gray-700/50 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSearchTerm("");
            setSelectedCategory("");
          }}
          className={`px-4 py-3 rounded-xl font-medium transition-colors ${
            isDark
              ? "bg-gray-600 hover:bg-gray-500 text-white"
              : "bg-gray-300 hover:bg-gray-400 text-gray-900"
          }`}
        >
          Clear Filters
        </motion.button>
      </div>
    </div>
  );
};

export default AdminFilterBar;