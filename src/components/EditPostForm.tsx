'use client';

import { useRouter } from '@/hooks';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Editor, { SubmitActionParams } from './Editor';
import SpinningLoader from './SpinningLoader';

export default function EditPostForm({ postId }: { postId: string }) {
  const user = useUser();
  const post = useQuery(api.posts.getPostById, {
    id: postId as Id<'posts'>,
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

  if (user.isLoaded && post !== undefined) {
    return (
      <Editor
        clerkUserId={user.user.id}
        post={post}
        submitAction={submitAction}
      />
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <SpinningLoader className="animate-spin w-5 h-5" />
      Loading...
    </div>
  );
}
