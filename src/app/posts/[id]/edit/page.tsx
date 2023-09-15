'use client';

import Editor, { SubmitActionParams } from '@/components/Editor';
import SpinningLoader from '@/components/SpinningLoader';
import { useRouter } from '@/hooks';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const user = useUser();
  const post = useQuery(api.posts.getPostById, {
    id: params.id as Id<'posts'>,
  });
  const createOrUpdatePost = useMutation(api.posts.createOrUpdatePost);
  const router = useRouter();

  if (user.isSignedIn === false) {
    router.push('/login');
    return;
  }

  if (post === 'POST_NOT_FOUND' || post === 'USER_FOR_POST_NOT_FOUND') {
    // TODO: Return actual not found component
    return <h1>Not Found</h1>;
  }

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
        throw Error('Unable to update post');
      default:
        router.push(`/posts/${post?._id}`);
        return;
    }
  }

  return (
    <main className='flex flex-col flex-1 w-full items-center'>
      {user.isLoaded && post !== undefined ? (
        <Editor
          clerkUserId={user.user.id}
          post={post}
          submitAction={submitAction}
        />
      ) : (
        <div className='flex gap-2 items-center'>
          <SpinningLoader className='animate-spin w-5 h-5' />
          Loading...
        </div>
      )}
    </main>
  );
}
