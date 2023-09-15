'use client';

import { usePaginatedQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Loader from './Loader';
import Post from './Post';

export default function AllPosts() {
  const PAGE_SIZE = 10;
  const pager = usePaginatedQuery(
    api.posts.getAllPostsWithUser,
    {},
    { initialNumItems: PAGE_SIZE }
  );

  function handleLoadMoreClick() {
    pager.loadMore(PAGE_SIZE);
  }

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='flex flex-col items-center w-full'>
        {pager.results.map(post => (
          <div
            key={post._id}
            className='w-full border border-t-0 border-gray-600 first:border-t last:rounded-b-md p-1 last:mb-4'
          >
            <Post post={post} />
          </div>
        ))}
      </div>
      <Loader
        isLoading={pager.isLoading}
        status={pager.status}
        loadButtonClickHandler={handleLoadMoreClick}
      />
    </div>
  );
}
