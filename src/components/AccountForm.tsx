'use client';

import { UserProfile } from '@clerk/nextjs';

export default function AccountForm() {
  return (
    <UserProfile
      appearance={{
        elements: {
          card: 'sm:pb-4 shadow-md dark:bg-secondary-gray [&_*:not(button):not(a)]:dark:text-white [&_.cl-internal-b3fm6y]:hidden',
          navbar: 'hidden',
          navbarMobileMenuRow: 'hidden',
          formFieldInput: 'dark:bg-primary-gray dark:text-white',
          profileSectionTitle: 'dark:border-white dark:border-opacity-10',
          breadcrumbsItem: 'dark:text-white',
        },
      }}
    />
  );
}
