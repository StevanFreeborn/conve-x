'use client';

import { useMountedEffect, useProgressEffect } from '@/hooks';
import { useTheme } from 'next-themes';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';

export default function ThemeButton() {
  useProgressEffect();
  const { mounted, Loader } = useMountedEffect();
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      className="flex items-center justify-center"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {mounted === false ? (
        <Loader className="animate-spin w-6 h-6" />
      ) : isDark ? (
        <BsMoonStarsFill className="w-6 h-6" />
      ) : (
        <BsSunFill className="w-6 h-6" />
      )}
    </button>
  );
}
