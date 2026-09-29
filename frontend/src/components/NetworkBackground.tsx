import React from 'react';
import { Theme } from '../hooks/useTheme';

interface NetworkBackgroundProps {
  theme?: Theme;
}

export const NetworkBackground: React.FC<NetworkBackgroundProps> = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-200" />
  );
};
