import Image from 'next/image';
import { AiFillCalendar } from 'react-icons/ai';
import { Doc, Id } from '../../convex/_generated/dataModel';

export default function UserProfile({
  user,
}: {
  user: {
    _id: Id<'users'>;
    _creationTime: number;
    clerkUsername: string | null;
    clerkImageUrl: string;
  };
}) {
  const username = user.clerkUsername ?? user._id;
  const userCreatedDate = new Date(user._creationTime);
  const monthJoined = userCreatedDate.toLocaleString(undefined, {
    month: 'short',
  });
  const yearJoined = userCreatedDate.getFullYear();

  return (
    <div className='w-full'>
      <div className='shadow-md bg-gradient-to-r from-violet-600 via-violet-600 to-indigo-600 rounded-t-md pt-20 pl-5 pr-40'>
        <div className='flex items-center gap-4 -mb-[25px]'>
          <div>
            <Image
              alt='user profile image'
              src={user.clerkImageUrl}
              width={100}
              height={100}
              className='rounded-full object-cover border-4 border-primary-accent'
            />
          </div>
          <div>
            <h1 className='font-bold'>{username}</h1>
            <div className='flex gap-2 items-center text-sm'>
              <AiFillCalendar className='w-4 h-4' />
              {`Joined ${monthJoined} ${yearJoined}`}
            </div>
          </div>
        </div>
      </div>
      <div className='h-[50px] bg-white dark:bg-primary-gray pl-5 pr-40 border border-gray-600'></div>
    </div>
  );
}
