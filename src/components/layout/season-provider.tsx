'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

type SeasonContextValue = {
  season: Season;
};

const SeasonContext = createContext<SeasonContextValue>({ season: 'spring' });

const determineSeason = (date: Date): Season => {
  const month = date.getMonth() + 1;
  if (month >= 3 && month < 6) return 'spring';
  if (month >= 6 && month < 9) return 'summer';
  if (month >= 9 && month < 12) return 'autumn';
  return 'winter';
};

const applySeasonalTheme = (season: Season) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const mapping: Record<Season, Record<string, string>> = {
    spring: {
      '--season-gradient': 'var(--season-spring-gradient)',
      '--season-background': 'var(--season-spring-bg)',
      '--season-accent': 'var(--season-spring-accent)',
      '--season-muted': 'var(--season-spring-muted)',
      '--season-foreground': 'var(--season-spring-foreground)',
      '--season-ring': 'var(--season-spring-ring)'
    },
    summer: {
      '--season-gradient': 'var(--season-summer-gradient)',
      '--season-background': 'var(--season-summer-bg)',
      '--season-accent': 'var(--season-summer-accent)',
      '--season-muted': 'var(--season-summer-muted)',
      '--season-foreground': 'var(--season-summer-foreground)',
      '--season-ring': 'var(--season-summer-ring)'
    },
    autumn: {
      '--season-gradient': 'var(--season-autumn-gradient)',
      '--season-background': 'var(--season-autumn-bg)',
      '--season-accent': 'var(--season-autumn-accent)',
      '--season-muted': 'var(--season-autumn-muted)',
      '--season-foreground': 'var(--season-autumn-foreground)',
      '--season-ring': 'var(--season-autumn-ring)'
    },
    winter: {
      '--season-gradient': 'var(--season-winter-gradient)',
      '--season-background': 'var(--season-winter-bg)',
      '--season-accent': 'var(--season-winter-accent)',
      '--season-muted': 'var(--season-winter-muted)',
      '--season-foreground': 'var(--season-winter-foreground)',
      '--season-ring': 'var(--season-winter-ring)'
    }
  };

  Object.entries(mapping[season]).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.classList.remove('season-spring', 'season-summer', 'season-autumn', 'season-winter');
  root.classList.add(`season-${season}`);
};

export const SeasonProvider = ({ children }: { children: React.ReactNode }) => {
  const [season, setSeason] = useState<Season>('spring');

  useEffect(() => {
    const current = determineSeason(new Date());
    setSeason(current);
    applySeasonalTheme(current);
  }, []);

  const value = useMemo(() => ({ season }), [season]);

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
};

export const useSeason = () => useContext(SeasonContext);
