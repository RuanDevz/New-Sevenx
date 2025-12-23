import React from 'react';
import { useLocation } from 'react-router-dom';
import DownloadButton from './DownloadButton';
import { motion } from 'framer-motion';

interface DownloadOptionsProps {
  primaryLinks: {
    linkG?: string;
    linkP?: string;
    pixeldrain?: string;
    LINKMV1?: string;
    LINKMV2?: string;
    LINKMV3?: string;
  };
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ primaryLinks }) => {
  const location = useLocation();

  const getTheme = () => {
    if (location.pathname.includes('/vip')) return 'vip';
    if (location.pathname.includes('/western')) return 'western';
    if (location.pathname.includes('/asian')) return 'asian';
    if (location.pathname.includes('/banned')) return 'banned';
    if (location.pathname.includes('/unknown')) return 'unknown';
    return 'asian';
  };

  const theme = getTheme();
  const isVip = theme === 'vip';

  const themeConfig = {
    asian: {
      button: {
        primary: 'from-purple-500 to-purple-600',
        hover: 'hover:from-purple-600 hover:to-purple-700',
        shadow: 'hover:shadow-purple-500/20',
      },
      title: 'text-purple-400',
    },
    western: {
      button: {
        primary: 'from-orange-500 to-orange-600',
        hover: 'hover:from-orange-600 hover:to-orange-700',
        shadow: 'hover:shadow-orange-500/20',
      },
      title: 'text-orange-400',
    },
    vip: {
      button: {
        primary: 'from-yellow-500 to-yellow-600',
        hover: 'hover:from-yellow-600 hover:to-yellow-700',
        shadow: 'hover:shadow-yellow-500/20',
      },
      title: 'text-yellow-400',
    },
    banned: {
      button: {
        primary: 'from-red-500 to-red-600',
        hover: 'hover:from-red-600 hover:to-red-700',
        shadow: 'hover:shadow-red-500/20',
      },
      title: 'text-red-400',
    },
    unknown: {
      button: {
        primary: 'from-gray-500 to-gray-600',
        hover: 'hover:from-gray-600 hover:to-gray-700',
        shadow: 'hover:shadow-gray-500/20',
      },
      title: 'text-gray-400',
    },
  };

  const colors = themeConfig[theme];

  /* ================= VIP ================= */
  if (isVip) {
    const vipLinks = [
      { label: 'MEGA 1', url: primaryLinks.linkG },
      { label: 'MEGA 2', url: primaryLinks.linkP },
      { label: 'Pixeldrain', url: primaryLinks.pixeldrain },
    ].filter(l => l.url);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {vipLinks.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <DownloadButton
                url={option.url}
                label={option.label}
                bgColor={colors.button.primary}
                hoverColor={colors.button.hover}
                shadowColor={colors.button.shadow}
                textColor="text-white"
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= NORMAL ================= */

  const vertiseLinks = [
    { label: 'MEGA 1', url: primaryLinks.linkG },
    { label: 'MEGA 2', url: primaryLinks.linkP },
    { label: 'Pixeldrain', url: primaryLinks.pixeldrain },
  ].filter(l => l.url);

  const admavenLinks = [
    { label: 'MEGA 1', url: primaryLinks.LINKMV1 },
    { label: 'MEGA 2', url: primaryLinks.LINKMV2 },
    { label: 'Pixeldrain', url: primaryLinks.LINKMV3 },
  ].filter(l => l.url);

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {vertiseLinks.length > 0 && (
        <div>
          <h3
            className={`mb-3 text-xs sm:text-sm font-bold uppercase tracking-wide ${colors.title}`}
          >
            Option 1 · Linkvertise
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {vertiseLinks.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <DownloadButton
                  url={option.url}
                  label={option.label}
                  bgColor={colors.button.primary}
                  hoverColor={colors.button.hover}
                  shadowColor={colors.button.shadow}
                  textColor="text-white"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {admavenLinks.length > 0 && (
        <div>
          <h3
            className={`mb-3 text-xs sm:text-sm font-bold uppercase tracking-wide ${colors.title}`}
          >
            Option 2 · Admaven
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {admavenLinks.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <DownloadButton
                  url={option.url}
                  label={option.label}
                  bgColor={colors.button.primary}
                  hoverColor={colors.button.hover}
                  shadowColor={colors.button.shadow}
                  textColor="text-white"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadOptions;
