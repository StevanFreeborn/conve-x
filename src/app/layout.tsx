import Navbar from '@/components/Navbar';
import { ConvexProvider, NextThemesProvider } from '@/providers';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'conveX',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className='w-full h-full'
      suppressHydrationWarning
    >
      <body
        className={`w-full h-full flex flex-col bg-white text-primary-gray dark:bg-primary-gray dark:text-white ${inter.className}`}
      >
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ConvexProvider>
            <NextThemesProvider>
              <Navbar />
              <div className='p-4'>{children}</div>
            </NextThemesProvider>
          </ConvexProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
