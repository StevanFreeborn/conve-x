'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function ProfileLink() {
  const user = useUser();

  if (user.isSignedIn !== true) {
    return <span>Profile</span>;
  }

  return <Link href={`/profile/${user.user.id}`}>Profile</Link>;
}
