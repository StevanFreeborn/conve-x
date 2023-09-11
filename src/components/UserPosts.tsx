'use client';

import { usePaginatedQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Post from './Post';
import SpinningLoader from './SpinningLoader';

export default function UserPosts({
  user,
}: {
  user: {
    _id: Id<'users'>;
    _creationTime: number;
    clerkUsername: string | null;
    clerkImageUrl: string;
  };
}) {
  const PAGE_SIZE = 1;
  const pager = usePaginatedQuery(
    api.posts.getUsersPostById,
    {
      userId: user._id,
    },
    { initialNumItems: PAGE_SIZE }
  );

  const postsWithUser = pager.results.map(post => ({ ...post, user }));

  return (
    <div className='flex flex-col items-center w-full h-full'>
      {postsWithUser.map(post => (
        <Post
          key={post._id}
          post={post}
        />
      ))}
      {pager.isLoading ? (
        <div className='flex items-center gap-2 p-5'>
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
