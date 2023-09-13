'use client';

import Editor, { SubmitActionParams } from '@/components/Editor';
import Post from '@/components/Post';
import SpinningLoader from '@/components/SpinningLoader';
import { useRouter } from '@/hooks';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
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
  const router = useRouter();
  const post = useQuery(api.posts.getPostById, {
    id: params.id as Id<'posts'>,
  });
  const createOrUpdatePost = useMutation(api.posts.createOrUpdatePost);

  async function submitAction({
    clerkUserId,
    parentPostId,
    post,
    currentDoc,
  }: SubmitActionParams) {
    const result = await createOrUpdatePost({
      parentPostId: parentPostId,
      id: post?._id,
      clerkUserId: clerkUserId,
      content: currentDoc,
    });

    switch (result) {
      case 'USER_NOT_FOUND':
      case 'USER_NOT_AUTHORIZED':
      case 'CANNOT_POST_ON_BEHALF_OF_ANOTHER_USER':
        throw Error('Unable to create post');
      default:
        return;
    }
  }

  if (user.isSignedIn === false) {
    router.push('/login');
    return;
  }

  if (post === 'POST_NOT_FOUND' || post === 'USER_FOR_POST_NOT_FOUND') {
    // TODO: Return actual not found component
    return <h1>Not Found</h1>;
  }

  return (
    <main className='flex flex-col flex-1 w-full items-center'>
      <div className='flex flex-col w-full max-w-4xl gap-4'>
        {post !== undefined && user.isLoaded ? (
          <>
            <div className='flex flex-col min-w-0 p-1 rounded-md border border-gray-600'>
              <Post
                post={post}
                limit={false}
                showReply={false}
              />
            </div>
            <div className='flex w-full h-80 gap-4'>
              <div>
                <Image
                  alt='user profile image'
                  src={user.user.imageUrl}
                  width={40}
                  height={40}
                  className='rounded-full object-cover border-4 border-primary-accent'
                />
              </div>

              <div className='flex w-full'>
                <Editor
                  clerkUserId={user.user.id}
                  parentPostId={post._id}
                  submitAction={submitAction}
                />
              </div>
            </div>
          </>
        ) : (
          <div className='flex w-full justify-center gap-2'>
            <SpinningLoader className='animate-spin w-5 h-5' /> Loading post...
          </div>
        )}
      </div>
    </main>
  );
}
