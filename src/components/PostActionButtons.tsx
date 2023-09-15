import Link from 'next/link';
import { BiSolidLike } from 'react-icons/bi';
import { BsFillReplyFill } from 'react-icons/bs';
import { Id } from '../../convex/_generated/dataModel';

export default function PostActionButton({
  postId,
  showReply,
}: {
  postId: Id<'posts'>;
  showReply: boolean;
}) {
  return (
    <div className='flex items-center gap-4'>
      {showReply ? (
        <Link
          className='px-3 py-2 border border-gray-600 rounded-md hover:bg-primary-accent hover:text-white'
          href={{ pathname: `/posts/${postId}`, query: { reply: true } }}
        >
          <BsFillReplyFill />
        </Link>
      ) : null}
      <button
        type='button'
        className='px-3 py-2 border border-gray-600 rounded-md'
      >
        <BiSolidLike />
      </button>
    </div>
  );
}
