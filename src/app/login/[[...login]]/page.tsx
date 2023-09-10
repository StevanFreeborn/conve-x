import { SignIn } from '@clerk/nextjs/app-beta';

export default function LoginPage() {
  return (
    <main className='flex flex-col items-center'>
      <SignIn appearance={{ elements: { card: 'shadow-md' } }} />
    </main>
  );
}
