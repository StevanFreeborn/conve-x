import EditPostForm from '@/components/EditPostForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'conveX | Edit post',
};

export default function EditPostPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-col flex-1 w-full items-center">
      <EditPostForm postId={params.id} />
    </main>
  );
}
