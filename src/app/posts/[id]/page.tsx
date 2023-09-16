import DisplayPost from '@/components/DisplayPost';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'conveX | Post',
};

export default function PostPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="flex flex-col flex-1 w-full items-center">
      <div className="flex flex-col w-full max-w-4xl gap-4">
        <DisplayPost
          postId={params.id}
          isReply={searchParams.reply === 'true'}
        />
      </div>
    </main>
  );
}
