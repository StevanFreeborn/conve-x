import Link from 'next/link';

export default function NotFound({
  heading = 'Not Found',
  message = "Hmmm it looks like we couldn't find what you were looking for.",
}: {
  heading?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center flex-1">
      <div className="flex flex-col items-center w-full max-w-4xl gap-4">
        <h2 className="text-2xl">{heading}</h2>
        <p>{message}</p>
        <Link
          className="px-3 py-1 text-white bg-primary-accent rounded-md"
          href="/"
        >
          Go to home page
        </Link>
      </div>
    </div>
  );
}
