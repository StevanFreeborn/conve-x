'use client';

import { useRouter } from '@/hooks';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BiLogIn, BiPlus } from 'react-icons/bi';
import { BsPersonPlusFill, BsSearch } from 'react-icons/bs';
import { ImProfile } from 'react-icons/im';
import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiUserFollowFill,
} from 'react-icons/ri';
import ThemeButton from './ThemeButton';
import UserButton from './UserButton';

export default function Navbar() {
  const [term, setTerm] = useState('');
  const { user } = useUser();
  const [navOpen, setNavOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handler() {
      if (navOpen) {
        setNavOpen(false);
      }
    }

    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="flex flex-col items-center gap-4 p-5 shadow-md dark:bg-secondary-gray md:flex-row md:justify-between">
      <div className="flex items-center justify-between w-full md:max-w-min">
        <Link href="/" className="italic">
          conve
          <span className="font-bold text-4xl text-primary-accent">X</span>
        </Link>
        <button
          onClick={() => setNavOpen(!navOpen)}
          type="button"
          className="flex items-center justify-center md:hidden"
        >
          {navOpen ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
        </button>
      </div>
      <div
        className="hidden flex-1 flex-col gap-4 w-full items-center md:flex md:flex-row md:justify-between"
        style={{ display: navOpen ? 'flex' : '' }}
      >
        <ul className="flex flex-col w-full items-start gap-4 md:flex-row md:items-center md:max-w-min">
          <SignedIn>
            <li className="flex w-full">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  router.push(`/search?term=${term}`);
                }}
                className="flex w-full relative"
              >
                <input
                  onChange={e => setTerm(e.target.value)}
                  value={term}
                  type="text"
                  placeholder="Search"
                  className="w-full md:w-[unset] py-1 px-2 rounded-md border border-gray-600 dark:bg-primary-gray dark:border-0"
                />
                <button
                  className="flex items-center justify-center absolute right-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  disabled={!term || !term.trim()}
                  type="submit"
                >
                  <BsSearch />
                </button>
              </form>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <div className="p-1 md:hidden">
                  <AiFillHome className="w-6 h-6" />
                </div>
                <Link onClick={() => setNavOpen(false)} href="/">
                  Home
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <div className="p-1 md:hidden">
                  <RiUserFollowFill className="w-6 h-6" />
                </div>
                <Link onClick={() => setNavOpen(false)} href="/following">
                  Following
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <div className="p-1 md:hidden">
                  <ImProfile className="w-6 h-6" />
                </div>
                <Link
                  onClick={() => setNavOpen(false)}
                  href={`/profile/${user?.id}`}
                >
                  Profile
                </Link>
              </div>
            </li>
            <li className="flex items-center gap-2 max-w-min whitespace-nowrap">
              <div className="p-1 bg-primary-accent rounded-md rounded-bl-none">
                <Link onClick={() => setNavOpen(false)} href="/posts/add">
                  <BiPlus className="w-6 h-6 text-white" />
                </Link>
              </div>
              <span className="md:hidden">Add Post</span>
            </li>
          </SignedIn>
        </ul>
        <ul className="flex flex-col w-full items-start gap-4 md:flex-row md:items-center md:max-w-min">
          <li className="flex items-center gap-2">
            <div className="p-1">
              <ThemeButton />
            </div>
            <span className="md:hidden">Change Theme</span>
          </li>
          <SignedIn>
            <li className="flex items-center gap-2">
              <UserButton />
              <span className="md:hidden">Manage Account</span>
            </li>
          </SignedIn>
          <SignedOut>
            <li>
              <div className="flex items-center gap-2">
                <div className="p-1 md:hidden">
                  <BiLogIn className="w-6 h-6" />
                </div>
                <Link href="/login" className="whitespace-nowrap">
                  Sign in
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <div className="p-1 md:hidden">
                  <BsPersonPlusFill className="w-6 h-6" />
                </div>
                <Link href="/signup" className="whitespace-nowrap">
                  Sign up
                </Link>
              </div>
            </li>
          </SignedOut>
        </ul>
      </div>
    </nav>
  );
}
