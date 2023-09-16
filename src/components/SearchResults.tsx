'use client';

import { UsePaginatedQueryReturnType, usePaginatedQuery } from 'convex/react';
import { FunctionReference } from 'convex/server';
import { useState } from 'react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import UserProfile from './UserProfile';

type UserSearchResultsPager = UsePaginatedQueryReturnType<
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
      page: {
        _id: Id<'users'>;
        _creationTime: number;
        clerkUsername: string | null;
        clerkImageUrl: string;
        clerkUserId: string;
      }[];
      isDone: boolean;
      continueCursor: string;
    }
  >
>;

function UserSearchResults({ pager }: { pager: UserSearchResultsPager }) {
  return (
    <div>
      <div>
        {pager.results.map(user => (
          <div key={user._id}>
            <UserProfile user={user} />
          </div>
        ))}
      </div>
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
    <div>
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

      {current === 'posts' ? 'Posts' : <UserSearchResults pager={usersPager} />}
    </div>
  );
}
