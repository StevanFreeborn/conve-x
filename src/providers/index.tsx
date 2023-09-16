'use client';

import { useAuth } from '@clerk/nextjs';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (CONVEX_URL === undefined) {
  throw Error('NEXT_PUBLIC_CONVEX_URL is undefined');
}

const client = new ConvexReactClient(CONVEX_URL);

export function ConvexProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={client} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export function NextThemesProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}
