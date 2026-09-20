import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEME_CONFIGS } from '../context/ThemeContext';
import { ThemePalette } from '../types';
import { Palette, Check } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, config } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="theme-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Change App Color Theme"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
            : 'bg-zinc-800/90 hover:bg-zinc-700/90 text-zinc-200 border-zinc-700/80 shadow-xs'
        }`}
      >
        <span
          className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30"
          style={{ backgroundColor: config.dotColor }}
        />
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden md:inline font-mono text-[11px]">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-2 border-b border-zinc-800">
            <span className="text-xs font-bold text-white block">Theme & Color Palette</span>
            <span className="text-[10px] text-zinc-400 block">Switch theme to match your other AI Studio app</span>
          </div>

          <div className="py-1 space-y-1">
            {(Object.keys(THEME_CONFIGS) as ThemePalette[]).map((themeKey) => {
              const item = THEME_CONFIGS[themeKey];
              const isSelected = theme === themeKey;
              return (
                <button
                  key={themeKey}
                  id={`theme-option-${themeKey}`}
                  onClick={() => {
                    setTheme(themeKey);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-xs border border-white/20"
                      style={{ backgroundColor: item.dotColor }}
                    />
                    <span className="text-xs">{item.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
