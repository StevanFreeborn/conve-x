import SearchResults from '@/components/SearchResults';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'conveX | Search',
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let term = searchParams.term;

  if (term === undefined) {
    term = '';
  }

  if (Array.isArray(term)) {
    term = term.length > 0 ? term[0] : '';
  }

  return (
    <main className="flex flex-col items-center flex-1">
      <div className="flex flex-col w-full max-w-4xl gap-4">
        <h1 className="text-4xl font-bold">Here&apos;s what we found</h1>
        <SearchResults term={term} />
      </div>
    </main>
  );
}
