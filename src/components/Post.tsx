import { Text } from '@codemirror/state';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';
import PostContent from './PostContent';
import SpinningLoader from './SpinningLoader';

export default function Post({ post }: { post: Doc<'posts'> }) {
  const user = useQuery(api.users.getUserById, { id: post.userId });

  if (user === undefined) {
    return (
      <div>
        <SpinningLoader className='animate-spin w-5 h-5' />
      </div>
    );
  }

  if (user === 'USER_NOT_FOUND') {
    return <div>User for post not found</div>;
  }

  const username = user.clerkUser.username ?? user._id;
  const createdPostDate = new Date(post._creationTime);
  const postYear = createdPostDate.getFullYear();
  const postMonth = createdPostDate.toLocaleString(undefined, {
    month: 'short',
  });
  const dayOfMonth = createdPostDate.getDate();

  return (
    <div className='flex w-full h-full gap-4 p-8 bg-white dark:bg-secondary-gray border border-gray-600'>
      <div>
        <Image
          alt='user profile image'
          src={user.clerkUser.image_url}
          width={40}
          height={40}
          className='rounded-full object-cover border-4 border-primary-accent'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <div>{username}</div>
          <div className='text-xs'>{`${postMonth} ${dayOfMonth}, ${postYear}`}</div>
        </div>
        <div>
          <PostContent content={Text.of(post.content).toString()} />
        </div>
        <div></div>
      </div>
    </div>
  );
}
