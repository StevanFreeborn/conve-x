'use client';

import NotFound from '@/app/not-found';
import { useRouter } from '@/hooks';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Editor, { SubmitActionParams } from './Editor';
import Post from './Post';
import PostReplies from './PostReplies';
import SpinningLoader from './SpinningLoader';

export default function DisplayPost({
  postId,
  isReply,
}: {
  postId: string;
  isReply: boolean;
}) {
  const replyRef = useRef<HTMLDivElement>(null);
  const user = useUser();
  const router = useRouter();
  const post = useQuery(api.posts.getPostById, {
    id: postId as Id<'posts'>,
  });
  const createOrUpdatePost = useMutation(api.posts.createOrUpdatePost);

  useEffect(() => {
    if (replyRef.current !== null && isReply) {
      replyRef.current.scrollIntoView();
    }
  }, [isReply, user]);

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
    return <NotFound />;
  }

  if (post !== undefined && user.isLoaded) {
    return (
      <>
        <div className="flex flex-col min-w-0 p-1 rounded-md border border-gray-600">
          <Post post={post} limit={false} showReply={false} />
        </div>
        <div className="w-full">
          <PostReplies parentId={post._id} />
        </div>
        <div className="flex w-full h-80 gap-4">
          <div>
            <Image
              style={{ height: '40px', width: '40px' }}
              alt="user profile image"
              src={user.user.imageUrl}
              width={40}
              height={40}
              className="rounded-full object-cover border-4 border-primary-accent"
            />
          </div>
          <div ref={replyRef} className="flex w-full">
            <Editor
              clerkUserId={user.user.id}
              parentPostId={post._id}
              submitAction={submitAction}
              autofocus={isReply}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex w-full justify-center gap-2">
      <SpinningLoader className="animate-spin w-5 h-5" /> Loading post...
    </div>
  );
}
