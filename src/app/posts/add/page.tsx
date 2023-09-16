'use client';

import Editor, { SubmitActionParams } from '@/components/Editor';
import SpinningLoader from '@/components/SpinningLoader';
import { useRouter } from '@/hooks';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function AddPost() {
  const user = useUser();
  const createOrUpdatePost = useMutation(api.posts.createOrUpdatePost);
  const router = useRouter();

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
        'use server';
        router.push('/');
        return;
    }
  }

  if (user.isSignedIn === false) {
    router.push('/login');
    return;
  }

  return (
    <main className="flex flex-col flex-1 w-full items-center">
      {user.isLoaded ? (
        <Editor clerkUserId={user.user.id} submitAction={submitAction} />
      ) : (
        <div className="flex gap-2 items-center">
          <SpinningLoader className="animate-spin w-5 h-5" />
          Loading...
        </div>
      )}
    </main>
  );
}
