import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { Id } from '../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function PostActionModal({ postId }: { postId: Id<'posts'> }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const deletePostById = useMutation(api.posts.deletePostById);

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

  async function handleDeleteButtonClick() {
    const result = confirm('Are you sure you want to delete this post?');

    if (result === false) {
      return;
    }

    await deletePostById({ id: postId });
  }

  return (
    <div className="relative">
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
              href={`/posts/${postId}/edit`}
            >
              Edit post
            </Link>
          </li>
          <li className="text-red-600">
            <button onClick={handleDeleteButtonClick} type="button">
              Delete post
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
