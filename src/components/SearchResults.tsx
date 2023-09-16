'use client';

import { PostWithUserDto, UserDto } from '@/app/types';
import { UsePaginatedQueryReturnType, usePaginatedQuery } from 'convex/react';
import { FunctionReference } from 'convex/server';
import { useState } from 'react';
import { api } from '../../convex/_generated/api';
import Loader from './Loader';
import Post from './Post';
import UserProfile from './UserProfile';

type Pager<T> = UsePaginatedQueryReturnType<
  FunctionReference<
    'query',
    'public',
    {
      term: string;
      paginationOpts: {
        id?: number | undefined;
        numItems: number;
        cursor: string | null;
      };
    },
    {
      page: T[];
      isDone: boolean;
      continueCursor: string;
    }
  >
>;

function NoResults() {
  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <h2 className='text-xl'>
        Hmmm it doesn&apos;t look like we could find anything.
      </h2>
    </div>
  );
}

function UserSearchResults({
  pager,
  pageSize,
}: {
  pager: Pager<UserDto>;
  pageSize: number;
}) {
  const { status, results, isLoading, loadMore } = pager;

  if (isLoading === false && results.length == 0) {
    return <NoResults />;
  }

  return (
    <div>
      <div className='flex flex-col gap-2'>
        {results.map(user => (
          <div key={user._id}>
            <UserProfile user={user} />
          </div>
        ))}
      </div>
      <Loader
        isLoading={isLoading}
        status={status}
        loadButtonClickHandler={() => loadMore(pageSize)}
      />
    </div>
  );
}

function PostSearchResults({
  pager,
  pageSize,
}: {
  pager: Pager<PostWithUserDto>;
  pageSize: number;
}) {
  const { status, results, isLoading, loadMore } = pager;

  if (isLoading === false && results.length == 0) {
    return <NoResults />;
  }

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='flex flex-col items-center w-full'>
        {results.map(post => (
          <div
            key={post._id}
            className='w-full border border-t-0 border-gray-600 first:border-t last:rounded-b-md p-1 last:mb-4'
          >
            <Post post={post} />
          </div>
        ))}
      </div>
      <Loader
        isLoading={isLoading}
        status={status}
        loadButtonClickHandler={() => loadMore(pageSize)}
      />
    </div>
  );
}

export default function SearchResults({ term }: { term: string }) {
  const PAGE_SIZE = 10;
  const [current, setCurrent] = useState<'posts' | 'users'>('posts');

  const postsPager = usePaginatedQuery(
    api.posts.getPostsBySearchTerm,
    { term },
    { initialNumItems: PAGE_SIZE }
  );
  const usersPager = usePaginatedQuery(
    api.users.getUsersBySearchTerm,
    { term },
    { initialNumItems: PAGE_SIZE }
  );

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-2 border-b border-gray-600'>
        <button
          onClick={() => setCurrent('posts')}
          disabled={current === 'posts'}
          type='button'
          className='py-1 px-2 border-b-4 border-transparent disabled:border-primary-accent'
        >
          Posts
        </button>
        <button
          onClick={() => setCurrent('users')}
          disabled={current === 'users'}
          type='button'
          className='py-1 px-2 border-b-4 border-transparent disabled:border-primary-accent'
        >
          Users
        </button>
      </div>

      {current === 'posts' ? (
        <PostSearchResults
          pager={postsPager}
          pageSize={PAGE_SIZE}
        />
      ) : (
        <UserSearchResults
          pager={usersPager}
          pageSize={PAGE_SIZE}
        />
      )}
    </div>
  );
}
