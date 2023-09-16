import NotFound from '@/app/not-found';
import UserPosts from '@/components/UserPosts';
import UserProfile from '@/components/UserProfile';
import { getConvexClient } from '@/lib/convex';
import { Metadata } from 'next';
import { api } from '../../../../convex/_generated/api';

export const metadata: Metadata = {
  title: 'conveX | Profile',
};

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const client = await getConvexClient();
  const user = await client.query(api.users.getUserByClerkId, {
    clerkUserId: params.id,
  });

  if (user === 'USER_NOT_FOUND') {
    return <NotFound />;
  }

  return (
    <main className="flex flex-col flex-1 w-full items-center">
      <div className="w-full max-w-4xl">
        <UserProfile user={user} />
        <UserPosts user={user} />
      </div>
    </main>
  );
}
