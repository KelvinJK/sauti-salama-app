import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

type Theme = 'light' | 'dark';

const Ctx = createContext<{ theme: Theme; setTheme: (t: Theme) => void; toggle: () => void }>({
  theme: 'light',
  setTheme: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  useEffect(() => {
    const saved = localStorage.getItem('ss-theme');
    if (saved === 'dark' || saved === 'light') setThemeState(saved);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setThemeState('dark');
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('ss-theme', t);
  };
  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={toggle}
      aria-label={theme === 'dark' ? t('theme_light') : t('theme_dark')}
      className={className}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
