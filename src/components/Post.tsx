import { PostWithUserDto } from '@/app/types';
import { Text } from '@codemirror/state';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { GoDotFill } from 'react-icons/go';
import PostContent from './PostContent';

export default function Post({ post }: { post: PostWithUserDto }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const username = post.user.clerkUsername ?? post.user._id;
  const createdPostDate = new Date(post._creationTime);
  const postYear = createdPostDate.getFullYear();
  const postMonth = createdPostDate.toLocaleString(undefined, {
    month: 'short',
  });
  const dayOfMonth = createdPostDate.getDate();

  // TODO: Posts content should only be allowed to grow to a set height
  // after which the post's content should be truncated
  // and we should display a 'more' link to load the post
  // in an individual page

  // TODO: Add menu button

  // TODO: Add reply and like buttons

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        modalOpen &&
        modalRef.current &&
        modalRef.current.contains(e.target as Node) === false
      ) {
        setModalOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [modalOpen]);

  function handleDeleteClick() {
    throw new Error('Function not implemented.');
  }

  return (
    <div className='flex w-full gap-4 p-8 bg-white dark:bg-secondary-gray'>
      <div>
        <Image
          alt='user profile image'
          src={post.user.clerkImageUrl}
          width={40}
          height={40}
          className='rounded-full object-cover border-4 border-primary-accent'
        />
      </div>
      <div className='flex flex-1 flex-col gap-2'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <div>{username}</div>
            <GoDotFill className='w-3 h-3' />
            <div className='text-xs'>
              {`${postMonth} ${dayOfMonth}, ${postYear}`}
            </div>
          </div>
          <div className='relative'>
            <button onClick={() => setModalOpen(!modalOpen)}>
              <BiDotsHorizontalRounded />
            </button>
            <div
              ref={modalRef}
              className={`${
                modalOpen ? '' : 'hidden'
              } max-w-min whitespace-nowrap absolute top-5 right-0 rounded-md py-2 pl-4 pr-10 shadow-md bg-white dark:bg-primary-gray`}
            >
              <ul>
                <li>
                  <Link href={`/posts/${post._id}/edit`}>Edit post</Link>
                </li>
                <li className='text-red-600'>
                  <button
                    onClick={handleDeleteClick}
                    type='button'
                  >
                    Delete post
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <PostContent content={Text.of(post.content).toString()} />
        </div>
        <div></div>
      </div>
    </div>
  );
}
