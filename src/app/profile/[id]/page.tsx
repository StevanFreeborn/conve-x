import UserPosts from '@/components/UserPosts';
import UserProfile from '@/components/UserProfile';
import { getConvexClient } from '@/lib/convex';
import { api } from '../../../../convex/_generated/api';

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const client = await getConvexClient();
  const user = await client.query(api.users.getUserByClerkId, {
    clerkUserId: params.id,
  });

  if (user === null) {
    // TODO: Show real not found component
    return <div>Not Found</div>;
  }

  return (
    <main className='flex flex-col w-full h-full items-center'>
      <div className='w-full max-w-4xl'>
        <UserProfile user={user} />
        <UserPosts user={user} />
      </div>
    </main>
  );
}
