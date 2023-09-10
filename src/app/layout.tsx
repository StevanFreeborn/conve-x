import Navbar from '@/components/Navbar';
import ConvexProvider from '@/providers';
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
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProvider>
        <html
          lang='en'
          className='w-full h-full'
        >
          <body className={`w-full h-full flex flex-col ${inter.className}`}>
            <Navbar />
            <div className='p-4'>{children}</div>
          </body>
        </html>
      </ConvexProvider>
    </ClerkProvider>
  );
}
