import Editor from '@/components/Editor';
import { getConvexClient } from '@/lib/convex';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await getConvexClient();
  const post = await client.query(api.posts.getPostById, {
    id: params.id as Id<'posts'>,
  });

  if (post === 'POST_NOT_FOUND' || post === 'USER_FOR_POST_NOT_FOUND') {
    // TODO: Return actual not found component
    return <h1>Not Found</h1>;
  }

  return (
    <main className='flex flex-col w-full h-full'>
      <Editor post={post} />
    </main>
  );
}
