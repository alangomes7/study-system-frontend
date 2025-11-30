import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLinks } from './NavLinks';
import { AuthButtons } from './AuthButtons';
import { STYLES, NAV_LINKS } from '../types/constants';
import { SessionData, NavRefs } from '../types/types';
import { useNavUiStore } from '../stores/useNavUiStore';

interface DesktopNavProps {
  session: SessionData;
  refs: NavRefs;
  onLogout: () => void;
}

export const DesktopNav = ({ session, refs, onLogout }: DesktopNavProps) => {
  const pathname = usePathname();
  const { isManageOpen, setManageOpen, isMobile } = useNavUiStore();
  const isManageActive = pathname.startsWith('/manage');

  return (
    <div className='hidden md:flex items-center space-x-2'>
      <NavLinks />

      {session.isLoggedIn && (
        <div
          ref={refs.manageMenuRef}
          className='relative'
          onMouseEnter={() => !isMobile && setManageOpen(true)}
          onMouseLeave={() => !isMobile && setManageOpen(false)}
        >
          <button
            className={`${
              isManageActive ? STYLES.activeNavLink : STYLES.navLink
            } w-full`}
          >
            Manage
          </button>

          {isManageOpen && (
            <div className='absolute right-0 w-56 bg-card-background border border-border rounded-md shadow-lg py-1 p-1 z-50 animate-dropdown-in'>
              <p className='px-4 py-2 text-xs font-semibold text-foreground/60'>
                Create
              </p>
              {NAV_LINKS.create.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    pathname === link.href
                      ? STYLES.activeMenuItem
                      : STYLES.menuItem
                  }
                >
                  {link.label}
                </Link>
              ))}

              {session.isAdmin && (
                <Link
                  href='/manage/create/user'
                  className={
                    pathname === '/manage/create/user'
                      ? STYLES.activeMenuItem
                      : STYLES.menuItem
                  }
                >
                  Register User (Admin)
                </Link>
              )}

              <div className='my-1 border-t border-border' />

              <p className='px-4 py-2 text-xs font-semibold text-foreground/60'>
                Enroll
              </p>
              {NAV_LINKS.enroll.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    pathname === link.href
                      ? STYLES.activeMenuItem
                      : STYLES.menuItem
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <Link
        href='/about'
        className={
          pathname === '/about' ? STYLES.activeNavLink : STYLES.navLink
        }
      >
        About
      </Link>

      <div className='ml-2'>
        <AuthButtons session={session} onLogout={onLogout} />
      </div>
    </div>
  );
};
