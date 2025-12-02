import React from 'react';
import { useLocation } from 'react-router-dom';
import DownloadButton from './DownloadButton';
import { motion } from 'framer-motion';

interface DownloadOptionsProps {
  // O usuário sempre preencherá apenas 3 destes 6 campos.
  primaryLinks: {
    // Vertise
    linkG?: string;       // MEGA
    linkP?: string;       // MEGA 2
    pixeldrain?: string;  // Pixeldrain
    // AdMaven
    LINKMV1?: string;     // MEGA
    LINKMV2?: string;     // MEGA 2
    LINKMV3?: string;     // Pixeldrain
  };
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ primaryLinks }) => {
  const location = useLocation();

  const getTheme = () => {
    if (location.pathname.includes('/western')) return 'western';
    if (location.pathname.includes('/asian')) return 'asian';
    if (location.pathname.includes('/vip')) return 'vip';
    if (location.pathname.includes('/banned')) return 'banned';
    if (location.pathname.includes('/unknown')) return 'unknown';
    return 'asian';
  };

  const theme = getTheme();

  const getThemeColors = () => {
    switch (theme) {
      case 'western':
        return {
          primary: 'from-orange-500 to-orange-600',
          hover: 'hover:from-orange-600 hover:to-orange-700',
          shadow: 'hover:shadow-orange-500/20'
        };
      case 'vip':
        return {
          primary: 'from-yellow-500 to-yellow-600',
          hover: 'hover:from-yellow-600 hover:to-yellow-700',
          shadow: 'hover:shadow-yellow-500/20'
        };
      case 'banned':
        return {
          primary: 'from-red-500 to-red-600',
          hover: 'hover:from-red-600 hover:to-red-700',
          shadow: 'hover:shadow-red-500/20'
        };
      case 'unknown':
        return {
          primary: 'from-gray-500 to-gray-600',
          hover: 'hover:from-gray-600 hover:to-gray-700',
          shadow: 'hover:shadow-gray-500/20'
        };
      case 'asian':
      default:
        return {
          primary: 'from-purple-500 to-purple-600',
          hover: 'hover:from-purple-600 hover:to-purple-700',
          shadow: 'hover:shadow-purple-500/20'
        };
    }
  };

  const colors = getThemeColors();

  // Normalização: mesmo rótulo, fontes distintas. Prioriza Vertise; na ausência, usa AdMaven.
  const sources: Record<string, (string | undefined)[]> = {
    'MEGA':      [primaryLinks.linkG, primaryLinks.LINKMV1],
    'MEGA 2':    [primaryLinks.linkP, primaryLinks.LINKMV3],
    'Pixeldrain':[primaryLinks.pixeldrain, primaryLinks.LINKMV2],
  };

  const availableOptions = Object.entries(sources)
    .map(([label, candidates]) => ({ name: label, url: candidates.find(Boolean) }))
    .filter(opt => Boolean(opt.url));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {availableOptions.map((option, index) => (
          <motion.div
            key={`${option.name}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DownloadButton
              url={option.url as string}
              label={option.name}
              bgColor={colors.primary}
              hoverColor={colors.hover}
              shadowColor={colors.shadow}
              textColor="text-white"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DownloadOptions;
