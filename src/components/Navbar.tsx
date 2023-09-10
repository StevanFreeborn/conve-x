import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import ThemeButton from './ThemeButton';

export default function Navbar() {
  return (
    <nav className='flex items-center justify-between p-5 shadow-md dark:bg-secondary-gray'>
      <ul className='flex items-center gap-4'>
        <li>
          <Link
            href='/'
            className='italic'
          >
            conve
            <span className='font-bold text-4xl text-primary-accent'>X</span>
          </Link>
        </li>
      </ul>
      <ul className='flex items-center gap-4'>
        <li>
          <ThemeButton />
        </li>
        <SignedIn>
          <li>
            <UserButton
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
          </li>
        </SignedIn>
        <SignedOut>
          <li>
            <Link href='/login'>Sign in</Link>
          </li>
          <li>
            <Link href='/signup'>Sign up</Link>
          </li>
        </SignedOut>
      </ul>
    </nav>
  );
}
