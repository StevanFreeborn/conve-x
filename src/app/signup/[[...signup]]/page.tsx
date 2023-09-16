import SignUpForm from '@/components/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'conveX | Sign up',
};

export default function SignUpPage() {
  return (
    <main className="flex flex-col flex-1 items-center">
      <SignUpForm />
    </main>
  );
}
