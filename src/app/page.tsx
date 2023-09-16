import AllPosts from '@/components/AllPosts';

export default function Home() {
  return (
    <main className="flex flex-col items-center flex-1">
      <div className="flex flex-col w-full max-w-4xl gap-4">
        <h1 className="text-4xl font-bold">Home</h1>
        <AllPosts />
      </div>
    </main>
  );
}
