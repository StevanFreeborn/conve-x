import { PostWithUserDto } from '@/app/types';
import { useUser } from '@clerk/nextjs';
import { Text } from '@codemirror/state';
import Image from 'next/image';
import PostActionButton from './PostActionButtons';
import PostActionModal from './PostActionModal';
import PostContent from './PostContent';

export default function Reply({ post }: { post: PostWithUserDto }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const username = post.user.clerkUsername ?? post.user._id;
  const created = new Date(post._creationTime);
  const month = created.toLocaleString(undefined, { month: 'short' });
  const day = created.getDate();
  const year = created.getFullYear();

  return (
    <div className='flex w-full gap-4'>
      <div>
        <Image
          alt='user profile image'
          src={post.user.clerkImageUrl}
          width={40}
          height={40}
          className='rounded-full object-cover border-4 border-primary-accent'
        />
      </div>
      <div className='flex flex-col flex-1 w-full border border-gray-600 rounded-md'>
        <div className='flex flex-col w-full p-1'>
          <div className='flex justify-between bg-primary-gray p-2'>
            <div className='text-sm'>
              {`${username} `}
              <span className='text-[#7a838f]'>{`replied on ${month} ${day}, ${year}`}</span>
            </div>
            {isLoaded && isSignedIn && user.id === post.user.clerkUserId ? (
              <PostActionModal postId={post._id} />
            ) : null}
          </div>
          <div className='p-1'>
            <div className='p-2 rounded-md bg-secondary-gray'>
              <PostContent content={Text.of(post.content).toString()} />
            </div>
          </div>
          <div className='p-1'>
            <PostActionButton
              postId={post._id}
              showReply={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
