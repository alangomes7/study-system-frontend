import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import { SessionData } from '../data/types';

interface AuthButtonsProps {
  session: SessionData;
  onLogout: () => void;
  isMobile?: boolean;
}

export const AuthButtons = ({
  session,
  onLogout,
  isMobile = false,
}: AuthButtonsProps) => {
  const pathname = usePathname();

  if (!session.isLoggedIn) {
    return (
      <Link
        href='/authentication/login'
        className={`btn btn-primary ${isMobile ? 'w-full' : ''} ${
          pathname === '/authentication/login' ? 'opacity-75' : ''
        }`}
      >
        Login
      </Link>
    );
  }

  const containerClass = isMobile
    ? 'flex flex-col gap-2'
    : 'flex items-center gap-2';
  const badgeClass = isMobile
    ? 'flex items-center justify-center gap-2 p-3 bg-card-background border border-border rounded-md shadow-sm'
    : 'flex items-center gap-2 px-4 py-2 text-sm text-foreground bg-card-background border border-border rounded-md shadow-sm';
  const btnClass = isMobile
    ? 'btn border border-border bg-card-background hover:bg-foreground/5 w-full flex items-center justify-center gap-2 transition-colors'
    : 'btn border border-border bg-card-background hover:bg-foreground/5 text-sm px-3 py-2 flex items-center gap-2 transition-colors';

  return (
    <div className={containerClass}>
      <div className={badgeClass}>
        <User className='w-4 h-4 text-primary' />
        <span>
          Hello, <span className='font-semibold'>{session.name}</span>
        </span>
      </div>
      <button onClick={onLogout} className={btnClass} title='Log out'>
        <LogOut className='w-4 h-4' />
        <span className={isMobile ? '' : 'sr-only lg:not-sr-only lg:inline'}>
          Log out
        </span>
      </button>
    </div>
  );
};
