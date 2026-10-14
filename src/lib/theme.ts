import { createContext, useContext } from 'react';

export type Theme = 'dark' | 'light';

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeState>({
  theme: 'dark',
  setTheme: () => undefined,
});

export function useTheme(): ThemeState {
  return useContext(ThemeContext);
}
