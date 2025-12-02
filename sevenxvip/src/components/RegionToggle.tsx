import React from 'react';
import { Globe, MapPin } from 'lucide-react';
import { useRegion } from '../contexts/RegionContext';
import { motion } from 'framer-motion';

const RegionToggle: React.FC = () => {
  const { region, setRegion } = useRegion();

  return (
    <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
      <motion.button
        onClick={() => setRegion('western')}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          region === 'western'
            ? 'bg-orange-500 text-white shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4" />
        Western
      </motion.button>
      
      <motion.button
        onClick={() => setRegion('asian')}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          region === 'asian'
            ? 'bg-purple-500 text-white shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MapPin className="w-4 h-4" />
        Asian
      </motion.button>
    </div>
  );
};

export default RegionToggle;