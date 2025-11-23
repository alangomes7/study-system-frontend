import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Access your account',
};

export default function LoginPage() {
  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-80px)] p-4 animate-fade-in'>
      <LoginForm />
    </div>
  );
}
