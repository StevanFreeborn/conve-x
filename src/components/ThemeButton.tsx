'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { ImSpinner2 } from 'react-icons/im';

export default function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = theme === 'dark';

  return (
    <button
      className='flex items-center justify-center'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {mounted === false ? (
        <ImSpinner2 className='w-5 h-5 animate-spin' />
      ) : isDark ? (
        <BsMoonStarsFill className='w-5 h-5' />
      ) : (
        <BsSunFill className='w-5 h-5' />
      )}
    </button>
  );
}
