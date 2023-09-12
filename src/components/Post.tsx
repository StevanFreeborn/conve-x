'use client';

import { PostWithUserDto } from '@/app/types';
import { Text } from '@codemirror/state';
import { useMutation } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { GoDotFill } from 'react-icons/go';
import { api } from '../../convex/_generated/api';
import PostContent from './PostContent';

export default function Post({ post }: { post: PostWithUserDto }) {
  const deletePostById = useMutation(api.posts.deletePostById);
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const username = post.user.clerkUsername ?? post.user._id;
  const createdPostDate = new Date(post._creationTime);
  const postYear = createdPostDate.getFullYear();
  const postMonth = createdPostDate.toLocaleString(undefined, {
    month: 'short',
  });
  const dayOfMonth = createdPostDate.getDate();

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

  async function handleDeleteClick() {
    setModalOpen(false);
    const result = confirm('Are you sure you want to delete this post?');

    if (result === false) {
      return;
    }

    await deletePostById({ id: post._id });
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
                  <Link
                    onClick={() => setModalOpen(false)}
                    href={`/posts/${post._id}/edit`}
                  >
                    Edit post
                  </Link>
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
        <div className='max-h-80 overflow-hidden text-ellipsis'>
          <PostContent
            content={Text.of(post.content.slice(0, 10)).toString()}
          />
        </div>
        <div>
          {post.content.length > 10 ? (
            <Link
              className='font-semibold text-primary-accent'
              href={`/posts/${post._id}`}
            >
              Show more
            </Link>
          ) : null}
        </div>
        <div></div>
      </div>
    </div>
  );
}
