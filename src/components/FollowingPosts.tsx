'use client';

import { usePaginatedQuery } from 'convex/react';
import Link from 'next/link';
import { api } from '../../convex/_generated/api';
import Loader from './Loader';
import Post from './Post';

export default function FollowingPosts() {
  const PAGE_SIZE = 10;
  const pager = usePaginatedQuery(
    api.posts.getAllPostsForFollowings,
    {},
    { initialNumItems: PAGE_SIZE }
  );

  function handleLoadMoreClick() {
    pager.loadMore(PAGE_SIZE);
  }

  if (pager.isLoading === false && pager.results.length == 0) {
    return (
      <div className='flex flex-col justify-center items-center gap-2'>
        <h2 className='text-2xl'>
          Hmmm it doesn&apos;t look like you follow anyone or anyone who has
          made a post yet.
        </h2>
        <Link
          href='/'
          className='max-w-max py-1 px-3 text-white bg-primary-accent rounded-md'
        >
          Find someone to follow
        </Link>
      </div>
    );
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
