import { UserDto } from '@/app/types';
import Image from 'next/image';
import { AiFillCalendar } from 'react-icons/ai';

export default function UserProfile({ user }: { user: UserDto }) {
  const username = user.clerkUsername ?? user._id;
  const userCreatedDate = new Date(user._creationTime);
  const monthJoined = userCreatedDate.toLocaleString(undefined, {
    month: 'short',
  });
  const yearJoined = userCreatedDate.getFullYear();

  return (
    <div className='w-full'>
      <div className='shadow-md bg-gradient-to-r from-violet-600 via-violet-600 to-indigo-600 rounded-t-md pt-20 px-5'>
        <div className='flex items-center gap-4 -mb-[25px]'>
          <div className='flex-shrink-0'>
            <Image
              alt='user profile image'
              src={user.clerkImageUrl}
              width={100}
              height={100}
              className='rounded-full object-cover border-4 border-primary-accent'
            />
          </div>
          <div className='flex flex-col flex-1 min-w-0 text-white'>
            <h1
              className='font-bold overflow-hidden text-ellipsis'
              title={username}
            >
              {username}
            </h1>
            <div className='flex gap-2 items-center text-sm'>
              <AiFillCalendar className='w-4 h-4' />
              {`Joined ${monthJoined} ${yearJoined}`}
            </div>
          </div>
        </div>
      </div>
      <div className='h-[50px] bg-white dark:bg-primary-gray pl-5 pr-40 border border-gray-600 border-b-0'></div>
    </div>
  );
}
