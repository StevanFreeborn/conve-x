'use client';

import { PostWithUserDto } from '@/app/types';
import { useUser } from '@clerk/nextjs';
import { Text } from '@codemirror/state';
import { useMutation } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { GoDotFill } from 'react-icons/go';
import { api } from '../../convex/_generated/api';
import PostActionButton from './PostActionButtons';
import PostActionModal from './PostActionModal';
import PostContent from './PostContent';

export default function Post({
  post,
  limit = true,
  showReply = true,
}: {
  post: PostWithUserDto;
  limit?: boolean;
  showReply?: boolean;
}) {
  const { isLoaded, user, isSignedIn } = useUser();
  const deletePostById = useMutation(api.posts.deletePostById);
  const username = post.user.clerkUsername ?? post.user._id;
  const createdPostDate = new Date(post._creationTime);
  const postYear = createdPostDate.getFullYear();
  const postMonth = createdPostDate.toLocaleString(undefined, {
    month: 'short',
  });
  const dayOfMonth = createdPostDate.getDate();
  const content = limit ? post.content.slice(0, 10) : post.content;
  const postLink = `/posts/${post._id}`;

  async function handleDeleteClick() {
    const result = confirm('Are you sure you want to delete this post?');

    if (result === false) {
      return;
    }

    await deletePostById({ id: post._id });
  }

  return (
    <div className="flex w-full gap-4 p-8 bg-white dark:bg-secondary-gray flex-wrap">
      <div className="flex-shrink-0">
        <Link href={`/profile/${post.user.clerkUserId}`}>
          <Image
            alt="user profile image"
            src={post.user.clerkImageUrl}
            width={40}
            height={40}
            className="rounded-full object-cover border-4 border-primary-accent"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <div className="overflow-hidden text-ellipsis" title={username}>
              {username}
            </div>
            <div className="flex items-center gap-2">
              <GoDotFill className="w-3 h-3" />
              <div className="text-xs">
                {`${postMonth} ${dayOfMonth}, ${postYear}`}
              </div>
            </div>
          </div>
          {isLoaded && isSignedIn && user.id === post.user.clerkUserId ? (
            <PostActionModal postId={post._id} />
          ) : null}
        </div>
        <div
          className={`${limit ? 'max-h-80' : ''} flex flex-col overflow-hidden`}
        >
          <PostContent content={Text.of(content).toString()} />
        </div>
        <div>
          {limit && post.content.length > 10 ? (
            <Link className="font-semibold text-primary-accent" href={postLink}>
              Show more
            </Link>
          ) : null}
        </div>
        <PostActionButton postId={post._id} showReply={showReply} />
      </div>
    </div>
  );
}
