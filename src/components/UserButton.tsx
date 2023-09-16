'use client';
import { useMountedEffect } from '@/hooks';
import { UserButton as ClerkUserButton } from '@clerk/nextjs';
import { ReactNode } from 'react';

export default function UserButton({ children }: { children?: ReactNode }) {
  const { mounted } = useMountedEffect();

  if (mounted === false) {
    return;
  }

  return (
    <ClerkUserButton
      appearance={{
        elements: {
          card: 'dark:bg-secondary-gray [&_*]:dark:text-white',
          userButtonTrigger:
            'border-solid border-2 border-primary-accent focus:shadow-none',
        },
      }}
      userProfileMode="navigation"
      userProfileUrl="/account"
      signInUrl="/login"
      afterSignOutUrl="/"
    />
  );
}
