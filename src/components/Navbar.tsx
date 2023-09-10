import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='flex items-center justify-between p-5 shadow-md'>
      <ul className='flex items-center gap-4'>
        <li>
          <Link href='/'>
            conve
            <span className='font-bold italic text-4xl text-primary-accent'>
              X
            </span>
          </Link>
        </li>
      </ul>
      <ul className='flex items-center gap-4'>
        <SignedIn>
          <li>
            <UserButton
              showName
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
