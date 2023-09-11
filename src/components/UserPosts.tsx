'use client';

import { UserDto } from '@/app/types';
import { usePaginatedQuery } from 'convex/react';
import Link from 'next/link';
import { api } from '../../convex/_generated/api';
import Post from './Post';
import SpinningLoader from './SpinningLoader';

export default function UserPosts({ user }: { user: UserDto }) {
  const PAGE_SIZE = 1;
  const pager = usePaginatedQuery(
    api.posts.getUsersPostById,
    {
      userId: user._id,
    },
    { initialNumItems: PAGE_SIZE }
  );

  const postsWithUser = pager.results.map(post => ({ ...post, user }));

  console.log(postsWithUser);

  if (pager.isLoading === false && postsWithUser.length == 0) {
    return (
      <div className='flex flex-col items-center justify-center border-t border-gray-600 w-full h-full'>
        <div className='flex flex-col items-center gap-2'>
          <h2 className='text-xl font-semibold'>
            Hmm...it doesn&apos;t look like you&apos;ve posted anything.
          </h2>
          <Link
            href='/posts/add'
            className='inline-flex max-w-max items-center justify-center px-3 py-1 bg-primary-accent rounded-md text-white'
          >
            Make a post
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='flex flex-col items-center w-full'>
        {postsWithUser.map(post => (
          <div
            key={post._id}
            className='w-full border border-t-0 border-gray-600 first:border-t last:rounded-b-md p-1'
          >
            <Post post={post} />
          </div>
        ))}
      </div>
      {pager.isLoading ? (
        <div className='flex w-full items-center justify-center gap-2 p-5 border-t border-gray-600'>
          <SpinningLoader className='animate-spin w-5 h-5' />
          Loading...
        </div>
      ) : pager.status === 'CanLoadMore' ? (
        <div className='flex items-center p-5'>
          <button
            className='bg-primary-accent px-3 py-1 rounded-full'
            onClick={() => pager.loadMore(PAGE_SIZE)}
            disabled={pager.status !== 'CanLoadMore'}
          >
            {pager.isLoading ? (
              <>
                <SpinningLoader className='animate-spin w-5 h-5' />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
