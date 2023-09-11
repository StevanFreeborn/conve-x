import { SignedIn, SignedOut, UserButton, currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import { BiSolidMessageSquareAdd } from 'react-icons/bi';
import ThemeButton from './ThemeButton';

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
            <Link
              href='/posts/add'
              className='text-primary-accent'
            >
              <BiSolidMessageSquareAdd className='w-10 h-10' />
            </Link>
          </li>
        </SignedIn>
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
