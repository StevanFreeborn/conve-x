import { usePaginatedQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Loader from './Loader';
import Reply from './Reply';

export default function PostReplies({ parentId }: { parentId: Id<'posts'> }) {
  const PAGE_SIZE = 10;
  const pager = usePaginatedQuery(
    api.posts.getRepliesByParentId,
    { id: parentId },
    { initialNumItems: PAGE_SIZE }
  );

  function handleLoadMoreClick() {
    pager.loadMore(PAGE_SIZE);
  }

  if (pager.isLoading === false && pager.results.length === 0) {
    return;
  }

  return (
    <div className='flex flex-col-reverse items-center w-full gap-4'>
      <div className='flex flex-col-reverse items-center w-full gap-4'>
        {pager.results.map(reply => (
          <div
            key={reply._id}
            className='w-full'
          >
            <Reply post={reply} />
          </div>
        ))}
      </div>
      <Loader
        isLoading={pager.isLoading}
        status={pager.status}
        loadButtonClickHandler={handleLoadMoreClick}
      />
    </div>
  );
}
