'use client';

import { UserProfile } from '@clerk/nextjs';

export default function AccountPage() {
  return (
    <main className='flex flex-col items-center'>
      <UserProfile
        appearance={{
          elements: {
            card: 'shadow-md dark:bg-secondary-gray [&_*:not(button):not(a)]:dark:text-white',
            navbar: 'dark:bg-secondary-gray [&_*]:dark:text-white',
            formFieldInput: 'dark:bg-primary-gray dark:text-white',
            profileSectionTitle: 'dark:border-white dark:border-opacity-10',
          },
        }}
      />
    </main>
  );
}
