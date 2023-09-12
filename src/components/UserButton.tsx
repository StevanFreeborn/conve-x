'use client';
import { useMountedEffect } from '@/hooks';
import { UserButton as ClerkUserButton } from '@clerk/nextjs';

export default function UserButton() {
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
      userProfileMode='navigation'
      userProfileUrl='/account'
      signInUrl='/login'
      afterSignOutUrl='/'
    />
  );
}
