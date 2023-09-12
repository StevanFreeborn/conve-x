import { SignedIn, SignedOut, currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import { BiPlus, BiSolidMessageSquare } from 'react-icons/bi';
import ThemeButton from './ThemeButton';
import UserButton from './UserButton';

export default async function Navbar() {
  const user = await currentUser();

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
        <SignedIn>
          <li>
            {/* TODO: Style this */}
            <div>
              <input
                type='text'
                placeholder='Search'
              />
            </div>
          </li>
          <li>
            <Link href='#'>Following</Link>
          </li>
          <li>
            <Link href={`/profile/${user?.id}`}>Profile</Link>
          </li>
          <li>
            <div className='mx-4'>
              <Link
                href='/posts/add'
                className='relative'
              >
                <BiSolidMessageSquare className='absolute w-10 h-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-accent' />
                <BiPlus className='absolute w-5 h-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white' />
              </Link>
            </div>
          </li>
        </SignedIn>
      </ul>
      <ul className='flex items-center gap-4'>
        <li>
          <ThemeButton />
        </li>
        <SignedIn>
          <li>
            <UserButton />
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
