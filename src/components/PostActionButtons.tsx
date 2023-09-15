import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';
import { BiSolidLike } from 'react-icons/bi';
import { BsFillReplyFill } from 'react-icons/bs';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export default function PostActionButton({
  postId,
  showReply,
}: {
  postId: Id<'posts'>;
  showReply: boolean;
}) {
  const like = useQuery(api.likes.getLike, { postId });
  const likeCount = useQuery(api.likes.getPostLikeCount, { postId });
  const replyCount = useQuery(api.posts.getPostReplyCount, { postId });
  const removeLike = useMutation(api.likes.removeLike);
  const addLike = useMutation(api.likes.addLike);
  const isLiked = like !== null;

  async function handleLikeClick() {
    if (isLiked) {
      await removeLike({ postId });
      return;
    }

    await addLike({ postId });
  }

  return (
    <div className='flex items-center gap-4'>
      {showReply && replyCount !== undefined ? (
        <Link
          className='flex items-center justify-center gap-2 px-3 py-1 border border-gray-600 rounded-md hover:bg-primary-accent hover:text-white'
          href={{ pathname: `/posts/${postId}`, query: { reply: true } }}
        >
          <BsFillReplyFill />
          <div className='flex items-center justify-center h-6 w-6 rounded-full text-xs bg-primary-gray text-white'>
            {replyCount}
          </div>
        </Link>
      ) : null}
      {like !== undefined && likeCount !== undefined ? (
        <button
          onClick={handleLikeClick}
          type='button'
          className={`flex items-center justify-center gap-2 px-3 py-1 border border-gray-600 rounded-md ${
            isLiked ? 'text-primary-accent' : ''
          }`}
        >
          <BiSolidLike className='flex-shrink-0' />
          <div className='flex items-center justify-center h-6 w-6 rounded-full text-xs bg-primary-gray text-white'>
            {likeCount}
          </div>
        </button>
      ) : null}
    </div>
  );
}
