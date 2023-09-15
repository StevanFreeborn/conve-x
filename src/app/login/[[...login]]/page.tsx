'use client';

import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <main className='flex flex-col flex-1 items-center'>
      <SignIn
        appearance={{
          elements: {
            card: 'shadow-md dark:bg-secondary-gray [&_*:not(button):not(a)]:dark:text-white [&_.cl-internal-b3fm6y]:hidden',
            socialButtonsIconButton__github:
              'hover:bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 dark:border-white dark:border-opacity-10',
            socialButtonsIconButton__google:
              'hover:bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 dark:border-white dark:border-opacity-10',
            socialButtonsIconButton__microsoft:
              'hover:bg-gradient-to-r from-red-600 via-green-600 to-blue-600 dark:border-white dark:border-opacity-10',
            dividerLine: 'dark:bg-white dark:bg-opacity-10',
            formFieldInput: 'dark:bg-primary-gray dark:text-white',
          },
        }}
      />
    </main>
  );
}
