'use client';

import Post from '@/components/Post';
import SpinningLoader from '@/components/SpinningLoader';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function PostPage({ params }: { params: { id: string } }) {
  const post = useQuery(api.posts.getPostById, {
    id: params.id as Id<'posts'>,
  });

  if (post === 'POST_NOT_FOUND' || post === 'USER_FOR_POST_NOT_FOUND') {
    // TODO: Return actual not found component
    return <h1>Not Found</h1>;
  }

  return (
    <main className='flex flex-col flex-1 w-full items-center'>
      <div className='w-full max-w-4xl'>
        {post === undefined ? (
          <SpinningLoader className='animate-spin w-5 h-5' />
        ) : (
          <Post
            post={post}
            limit={false}
          />
        )}
      </div>
    </main>
  );
}
