import { Text } from '@codemirror/state';
import Image from 'next/image';
import { Doc, Id } from '../../convex/_generated/dataModel';
import PostContent from './PostContent';

export default function Post({
  post,
}: {
  post: Doc<'posts'> & {
    user: {
      _id: Id<'users'>;
      _creationTime: number;
      clerkUsername: string | null;
      clerkImageUrl: string;
    };
  };
}) {
  const username = post.user.clerkUsername ?? post.user._id;
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
          src={post.user.clerkImageUrl}
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
