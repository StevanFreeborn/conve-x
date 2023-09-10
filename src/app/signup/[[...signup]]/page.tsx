import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className='flex flex-col items-center'>
      <SignUp
        appearance={{
          elements: {
            card: 'shadow-md',
          },
        }}
      />
    </main>
  );
}
