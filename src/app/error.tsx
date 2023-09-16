'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col justify-center items-center flex-1">
      <div className="flex flex-col items-center w-full max-w-4xl gap-4">
        <h2 className="text-2xl">
          Oops it looks like we&apos;ve run into an issue.
        </h2>
        <button
          className="px-3 py-1 text-white bg-primary-accent rounded-md"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
