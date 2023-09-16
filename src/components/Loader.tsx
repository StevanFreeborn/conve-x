import SpinningLoader from './SpinningLoader';

export default function Loader({
  isLoading,
  status,
  loadButtonClickHandler,
}: {
  isLoading: boolean;
  status: string;
  loadButtonClickHandler: () => void;
}) {
  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center gap-2 p-5 text-sm">
        <SpinningLoader className="animate-spin w-5 h-5" />
        Loading...
      </div>
    );
  }

  if (status !== 'CanLoadMore') {
    return;
  }

  return (
    <div className="flex items-center">
      <button
        className="bg-primary-accent text-white px-3 py-1 rounded-full text-sm"
        onClick={loadButtonClickHandler}
        disabled={status !== 'CanLoadMore'}
      >
        {isLoading ? (
          <>
            <SpinningLoader className="animate-spin w-5 h-5" />
            Loading...
          </>
        ) : (
          'Load More'
        )}
      </button>
    </div>
  );
}
