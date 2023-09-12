'use client';

import Editor from '@/components/Editor';
import Post from '@/components/Post';
import SpinningLoader from '@/components/SpinningLoader';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function PostPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { reply?: boolean };
}) {
  const user = useUser();
  const post = useQuery(api.posts.getPostById, {
    id: params.id as Id<'posts'>,
  });

  if (post === 'POST_NOT_FOUND' || post === 'USER_FOR_POST_NOT_FOUND') {
    // TODO: Return actual not found component
    return <h1>Not Found</h1>;
  }

  return (
    <main className='flex flex-col flex-1 w-full items-center'>
      <div className='flex flex-col items-center w-full max-w-4xl gap-4'>
        {post === undefined ? (
          <div className='flex items-center gap-2'>
            <SpinningLoader className='animate-spin w-5 h-5' /> Loading post...
          </div>
        ) : (
          <>
            <div className='p-1 rounded-md border border-gray-600'>
              <Post
                post={post}
                limit={false}
                showReply={false}
              />
            </div>
            <div className='flex w-full h-80 gap-4'>
              {user.isSignedIn !== true ? null : (
                <div>
                  <Image
                    alt='user profile image'
                    src={user.user.imageUrl}
                    width={40}
                    height={40}
                    className='rounded-full object-cover border-4 border-primary-accent'
                  />
                </div>
              )}
              <Editor />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
