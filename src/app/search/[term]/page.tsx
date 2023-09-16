import SearchResults from '@/components/SearchResults';

export default function SearchPage({ params }: { params: { term: string } }) {
  return (
    <main className='flex flex-col items-center flex-1'>
      <div className='flex flex-col w-full max-w-4xl gap-4'>
        <h1 className='text-4xl font-bold'>Here&apos;s what we found</h1>
        <SearchResults term={params.term} />
      </div>
    </main>
  );
}
