import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getConfig, updateConfig } from '../services/configService';

// 主题类型定义
export type ThemeType = 'military' | 'ocean' | 'purple' | 'orange' | 'dark';

interface ThemeColors {
  name: string;
  bg0: string;
  bg1: string;
  panel: string;
  panelStrong: string;
  panelSoft: string;
  stroke: string;
  strokeStrong: string;
  text0: string;
  text1: string;
  accent: string;
  accent2: string;
}

// 主题配置
export const themes: Record<ThemeType, ThemeColors> = {
  military: {
    name: '韭菜绿',
    bg0: '#080d08',
    bg1: '#0e1610',
    panel: 'rgba(14, 22, 16, 0.75)',
    panelStrong: 'rgba(14, 22, 16, 0.92)',
    panelSoft: 'rgba(14, 22, 16, 0.56)',
    stroke: 'rgba(58, 95, 50, 0.22)',
    strokeStrong: 'rgba(58, 95, 50, 0.32)',
    text0: '#d8e0d6',
    text1: '#7a8a72',
    accent: '#3a5f32',
    accent2: '#5a8a4a',
  },
  ocean: {
    name: '海洋蓝',
    bg0: '#0a0f1a',
    bg1: '#0f1629',
    panel: 'rgba(15, 22, 41, 0.72)',
    panelStrong: 'rgba(15, 22, 41, 0.92)',
    panelSoft: 'rgba(15, 22, 41, 0.56)',
    stroke: 'rgba(56, 189, 248, 0.18)',
    strokeStrong: 'rgba(56, 189, 248, 0.28)',
    text0: '#e2e8f0',
    text1: '#94a3b8',
    accent: '#38bdf8',
    accent2: '#22d3ee',
  },
  purple: {
    name: '星空紫',
    bg0: '#0f0a1a',
    bg1: '#1a1025',
    panel: 'rgba(26, 16, 37, 0.72)',
    panelStrong: 'rgba(26, 16, 37, 0.92)',
    panelSoft: 'rgba(26, 16, 37, 0.56)',
    stroke: 'rgba(168, 85, 247, 0.18)',
    strokeStrong: 'rgba(168, 85, 247, 0.28)',
    text0: '#f0e8f5',
    text1: '#a89bb8',
    accent: '#a855f7',
    accent2: '#c084fc',
  },
  orange: {
    name: '暖橙',
    bg0: '#120d08',
    bg1: '#1f1610',
    panel: 'rgba(31, 22, 16, 0.72)',
    panelStrong: 'rgba(31, 22, 16, 0.92)',
    panelSoft: 'rgba(31, 22, 16, 0.56)',
    stroke: 'rgba(251, 146, 60, 0.18)',
    strokeStrong: 'rgba(251, 146, 60, 0.28)',
    text0: '#f5ebe0',
    text1: '#b8a08b',
    accent: '#fb923c',
    accent2: '#fdba74',
  },
  dark: {
    name: '暗夜黑',
    bg0: '#09090b',
    bg1: '#18181b',
    panel: 'rgba(24, 24, 27, 0.72)',
    panelStrong: 'rgba(24, 24, 27, 0.92)',
    panelSoft: 'rgba(24, 24, 27, 0.56)',
    stroke: 'rgba(161, 161, 170, 0.18)',
    strokeStrong: 'rgba(161, 161, 170, 0.28)',
    text0: '#fafafa',
    text1: '#a1a1aa',
    accent: '#a1a1aa',
    accent2: '#d4d4d8',
  },
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('military');

  // 从 config 加载主题
  useEffect(() => {
    getConfig().then((config) => {
      const savedTheme = config.theme as ThemeType;
      if (savedTheme && themes[savedTheme]) {
        setThemeState(savedTheme);
      }
    }).catch(() => {
      // 使用默认主题
    });
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      const config = await getConfig();
      config.theme = newTheme;
      await updateConfig(config);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  };

  // 应用主题到 CSS 变量
  useEffect(() => {
    const colors = themes[theme];
    const root = document.documentElement;

    root.style.setProperty('--bg-0', colors.bg0);
    root.style.setProperty('--bg-1', colors.bg1);
    root.style.setProperty('--panel', colors.panel);
    root.style.setProperty('--panel-strong', colors.panelStrong);
    root.style.setProperty('--panel-soft', colors.panelSoft);
    root.style.setProperty('--stroke', colors.stroke);
    root.style.setProperty('--stroke-strong', colors.strokeStrong);
    root.style.setProperty('--text-0', colors.text0);
    root.style.setProperty('--text-1', colors.text1);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-2', colors.accent2);

    // 设置 data-theme 属性用于 Tailwind
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
