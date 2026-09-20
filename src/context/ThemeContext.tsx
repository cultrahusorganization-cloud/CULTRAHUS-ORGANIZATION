import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemePalette } from '../types';

interface ThemeStyles {
  id: ThemePalette;
  name: string;
  dotColor: string;
  bodyBg: string;
  navBg: string;
  navBorder: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  accentBadge: string;
  accentText: string;
  primaryButton: string;
  secondaryButton: string;
  activeNavTab: string;
  statCardBg: string;
  inputBg: string;
}

export const THEME_CONFIGS: Record<ThemePalette, ThemeStyles> = {
  indigo: {
    id: 'indigo',
    name: 'Vercel / AI Studio (Indigo & Obsidian)',
    dotColor: '#6366f1',
    bodyBg: 'bg-zinc-950',
    navBg: 'bg-zinc-900/95',
    navBorder: 'border-zinc-800',
    cardBg: 'bg-zinc-900/80',
    cardBorder: 'border-zinc-800/80',
    textPrimary: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    accentBadge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    accentText: 'text-indigo-400',
    primaryButton: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/50',
    secondaryButton: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700',
    activeNavTab: 'bg-indigo-600 text-white shadow-sm',
    statCardBg: 'bg-zinc-900/90 border-zinc-800',
    inputBg: 'bg-zinc-950/70 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500/20',
  },
  amber: {
    id: 'amber',
    name: 'Cultrahus Gold (Obsidian & Amber)',
    dotColor: '#f59e0b',
    bodyBg: 'bg-stone-950',
    navBg: 'bg-stone-900/95',
    navBorder: 'border-stone-800',
    cardBg: 'bg-stone-900/85',
    cardBorder: 'border-stone-800/80',
    textPrimary: 'text-stone-100',
    textMuted: 'text-stone-400',
    accentBadge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    accentText: 'text-amber-400',
    primaryButton: 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-950/50',
    secondaryButton: 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700',
    activeNavTab: 'bg-amber-500 text-stone-950 font-bold shadow-sm',
    statCardBg: 'bg-stone-900/90 border-stone-800',
    inputBg: 'bg-stone-950/70 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:ring-amber-500/20',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyberpunk (Deep Slate & Cyan)',
    dotColor: '#06b6d4',
    bodyBg: 'bg-slate-950',
    navBg: 'bg-slate-900/95',
    navBorder: 'border-slate-800',
    cardBg: 'bg-slate-900/80',
    cardBorder: 'border-slate-800/80',
    textPrimary: 'text-slate-100',
    textMuted: 'text-slate-400',
    accentBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    accentText: 'text-cyan-400',
    primaryButton: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-950/50',
    secondaryButton: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700',
    activeNavTab: 'bg-cyan-500 text-slate-950 font-bold shadow-sm',
    statCardBg: 'bg-slate-900/90 border-slate-800',
    inputBg: 'bg-slate-950/70 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Tech (Forest & Mint)',
    dotColor: '#10b981',
    bodyBg: 'bg-zinc-950',
    navBg: 'bg-zinc-900/95',
    navBorder: 'border-zinc-800',
    cardBg: 'bg-zinc-900/80',
    cardBorder: 'border-zinc-800/80',
    textPrimary: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    accentBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    accentText: 'text-emerald-400',
    primaryButton: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50',
    secondaryButton: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700',
    activeNavTab: 'bg-emerald-600 text-white shadow-sm',
    statCardBg: 'bg-zinc-900/90 border-zinc-800',
    inputBg: 'bg-zinc-950/70 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20',
  },
  light: {
    id: 'light',
    name: 'Executive Studio (Clean Minimalist)',
    dotColor: '#18181b',
    bodyBg: 'bg-stone-50',
    navBg: 'bg-white/95',
    navBorder: 'border-stone-200',
    cardBg: 'bg-white',
    cardBorder: 'border-stone-200 shadow-sm',
    textPrimary: 'text-stone-900',
    textMuted: 'text-stone-500',
    accentBadge: 'bg-stone-100 text-stone-800 border-stone-300',
    accentText: 'text-stone-900',
    primaryButton: 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm',
    secondaryButton: 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300',
    activeNavTab: 'bg-stone-900 text-white shadow-sm',
    statCardBg: 'bg-white border-stone-200',
    inputBg: 'bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:ring-stone-900/10',
  }
};

interface ThemeContextType {
  theme: ThemePalette;
  setTheme: (theme: ThemePalette) => void;
  config: ThemeStyles;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePalette>(() => {
    try {
      const saved = localStorage.getItem('cultrahus_theme_palette');
      if (saved && (saved in THEME_CONFIGS)) {
        return saved as ThemePalette;
      }
    } catch {
      // fallback
    }
    return 'indigo'; // Default to modern Vercel / AI Studio Indigo & Obsidian
  });

  const setTheme = (newTheme: ThemePalette) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('cultrahus_theme_palette', newTheme);
    } catch {
      // ignore
    }
  };

  const config = THEME_CONFIGS[theme] || THEME_CONFIGS.indigo;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
