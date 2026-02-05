import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { useTheme, themes, ThemeType } from '../contexts/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeList: ThemeType[] = ['military', 'ocean', 'purple', 'orange', 'dark'];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg fin-panel border fin-divider text-slate-300 hover:text-white transition-colors"
        title="切换主题"
      >
        <Palette className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 fin-panel-strong border fin-divider rounded-lg p-2 min-w-[140px]">
            <div className="text-xs text-slate-400 px-2 py-1 mb-1">选择主题</div>
            {themeList.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                  theme === t
                    ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: themes[t].accent }}
                />
                {themes[t].name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
