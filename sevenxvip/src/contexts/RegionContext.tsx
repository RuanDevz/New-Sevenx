import React, { createContext, useContext, useEffect, useState } from 'react';

type Region = 'asian' | 'western';

interface RegionContextType {
  region: Region;
  setRegion: (region: Region) => void;
  getThemeColors: () => {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    gradient: string;
    gradientHover: string;
  };
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region, setRegion] = useState<Region>(() => {
    const savedRegion = localStorage.getItem('region');
    return (savedRegion as Region) || 'western';
  });

  useEffect(() => {
    localStorage.setItem('region', region);
  }, [region]);

  const getThemeColors = () => {
    if (region === 'asian') {
      return {
        primary: 'bg-purple-500',
        primaryHover: 'hover:bg-purple-600',
        primaryLight: 'bg-purple-100',
        gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
        gradientHover: 'hover:from-purple-600 hover:to-purple-700',
      };
    } else {
      return {
        primary: 'bg-orange-500',
        primaryHover: 'hover:bg-orange-600',
        primaryLight: 'bg-orange-100',
        gradient: 'bg-gradient-to-r from-orange-500 to-orange-600',
        gradientHover: 'hover:from-orange-600 hover:to-orange-700',
      };
    }
  };

  return (
    <RegionContext.Provider value={{ region, setRegion, getThemeColors }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};