'use client';

import { useTheme } from '@/hooks/useTheme'; // adjust path/alias as needed

// Using lucide-react icons via react-icons (clean, modern line style – very common for themes)
// Alternatives: 'fa6' → FaSun / FaMoon, 'bs' → BsSun / BsMoonStars, etc.
import { LuSun, LuMoon } from 'react-icons/lu';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <LuSun className="h-5 w-5" />
      ) : (
        <LuMoon className="h-5 w-5" />
      )}
    </button>
  );
}