'use client';

import { usePaginatedQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';
import Post from './Post';

export default function UserPosts({ user }: { user: Doc<'users'> }) {
  const PAGE_SIZE = 10;
  const pager = usePaginatedQuery(
    api.posts.getUsersPostById,
    {
      userId: user._id,
    },
    { initialNumItems: 10 }
  );

  return (
    <div className='flex flex-col w-full h-full'>
      {pager.results.map(post => (
        <Post
          key={post._id}
          post={post}
        />
      ))}
      {pager.isLoading ? (
        <div>Loading...</div>
      ) : (
        <button
          onClick={() => pager.loadMore(10)}
          disabled={pager.status !== 'CanLoadMore'}
        >
          Load More
        </button>
      )}
    </div>
  );
}
