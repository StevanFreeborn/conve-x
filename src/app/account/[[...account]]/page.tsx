import AccountForm from '@/components/AccountForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'conveX | Account',
};

export default function AccountPage() {
  return (
    <main className="flex flex-col flex-1 items-center">
      <AccountForm />
    </main>
  );
}
