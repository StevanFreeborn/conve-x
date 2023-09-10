import { UserProfile } from '@clerk/nextjs';

export default function AccountPage() {
  return (
    <main className='flex flex-col items-center'>
      <UserProfile />
    </main>
  );
}
