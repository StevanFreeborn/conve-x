'use client';

import { UserDto } from '@/app/types';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import Image from 'next/image';
import { AiFillCalendar } from 'react-icons/ai';
import { api } from '../../convex/_generated/api';

export default function UserProfile({ user }: { user: UserDto }) {
  const { isLoaded, isSignedIn, user: currentUser } = useUser();
  const addFollow = useMutation(api.follows.addFollow);
  const removeFollow = useMutation(api.follows.removeFollow);

  const followerCount = useQuery(api.follows.getUserFollowerCount, {
    userId: user._id,
  });

  const followingCount = useQuery(api.follows.getUserFollowingCount, {
    userId: user._id,
  });

  const isFollowing = useQuery(api.follows.getFollowing, {
    followingId: user._id,
  });

  const postCount = useQuery(api.posts.getUserPostCount, { userId: user._id });
  const username = user.clerkUsername ?? user._id;
  const userCreatedDate = new Date(user._creationTime);

  const monthJoined = userCreatedDate.toLocaleString(undefined, {
    month: 'short',
  });

  const yearJoined = userCreatedDate.getFullYear();

  const countDataLoaded =
    postCount !== undefined &&
    followerCount !== undefined &&
    followingCount !== undefined;

  async function handleFollowButtonClick() {
    if (isFollowing) {
      await removeFollow({ followingId: user._id });
      return;
    }

    await addFollow({ followingId: user._id });
  }

  return (
    <div className="w-full">
      <div className="shadow-md bg-gradient-to-r from-violet-600 via-violet-600 to-indigo-600 rounded-t-md pt-20 px-5">
        <div className="flex items-center gap-4 -mb-[25px]">
          <div className="flex-shrink-0">
            <Image
              alt="user profile image"
              src={user.clerkImageUrl}
              width={100}
              height={100}
              className="rounded-full object-cover border-4 border-primary-accent"
            />
          </div>
          <div className="flex flex-col-reverse mb-[25px] flex-1 min-w-0 gap-0.5 md:flex-row md:mb-0 md:gap-2">
            <div className="flex flex-col min-w-0 text-white">
              <h1
                className="font-bold overflow-hidden text-ellipsis"
                title={username}
              >
                {username}
              </h1>
              <div className="flex gap-2 items-center text-sm">
                <AiFillCalendar className="w-4 h-4" />
                {`Joined ${monthJoined} ${yearJoined}`}
              </div>
            </div>
            <div>
              {isLoaded && isSignedIn && currentUser.id !== user.clerkUserId ? (
                <button
                  onClick={handleFollowButtonClick}
                  type="button"
                  className={`py-0.5 px-3 rounded-full text-sm border border-white text-white ${
                    isFollowing ? 'bg-primary-accent' : 'o'
                  }`}
                >
                  Follow
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 bg-white dark:bg-primary-gray pl-5 border border-gray-600">
        <div className="flex flex-col min-h-[25px] items-start gap-1 py-1 pl-[116px] md:flex-row md:items-center md:gap-4">
          {countDataLoaded ? (
            <>
              <div>
                <span className="font-bold whitespace-nowrap">{postCount}</span>{' '}
                posts
              </div>
              <div className="min-w-0">
                <span className="font-bold whitespace-nowrap">
                  {followerCount}
                </span>{' '}
                followers
              </div>
              <div>
                <span className="font-bold whitespace-nowrap">
                  {followingCount}
                </span>{' '}
                following
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
