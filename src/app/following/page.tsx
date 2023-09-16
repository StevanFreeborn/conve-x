import FollowingPosts from '@/components/FollowingPosts';

export default function FollowingPage() {
  return (
    <main className="flex flex-col items-center flex-1">
      <div className="flex flex-col w-full max-w-4xl gap-4">
        <h1 className="text-4xl font-bold">Following</h1>
        <FollowingPosts />
      </div>
    </main>
  );
}
