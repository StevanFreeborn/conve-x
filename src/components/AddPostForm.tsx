'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useRouter } from '@/hooks';
import { api } from '../../convex/_generated/api';
import Editor, { SubmitActionParams } from './Editor';
import SpinningLoader from './SpinningLoader';

export default function AddPostForm() {
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

  if (user.isLoaded) {
    return <Editor clerkUserId={user.user.id} submitAction={submitAction} />;
  }

  return (
    <div className="flex gap-2 items-center">
      <SpinningLoader className="animate-spin w-5 h-5" />
      Loading...
    </div>
  );
}
