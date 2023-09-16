import AddPostForm from '@/components/AddPostForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'conveX | Add post',
};

export default function AddPost() {
  return (
    <main className="flex flex-col flex-1 w-full items-center">
      <AddPostForm />
    </main>
  );
}
