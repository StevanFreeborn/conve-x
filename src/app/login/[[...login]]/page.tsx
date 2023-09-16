import LoginForm from '@/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'conveX | Login',
};

export default function LoginPage() {
  return (
    <main className="flex flex-col flex-1 items-center">
      <LoginForm />
    </main>
  );
}
