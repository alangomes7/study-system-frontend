import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLinks } from './NavLinks';
import { AuthButtons } from './AuthButtons';
import { STYLES, NAV_LINKS } from '../data/constants';
import { SessionData, NavRefs } from '../data/types';
import { useNavUiStore } from '../stores/useNavUiStore';

interface MobileNavProps {
  session: SessionData;
  refs: NavRefs;
  onClose: () => void;
  onLogout: () => void;
}

export const MobileNav = ({
  session,
  refs,
  onClose,
  onLogout,
}: MobileNavProps) => {
  const pathname = usePathname();
  const store = useNavUiStore();

  const isManageActive = pathname.startsWith('/manage');
  const isCreateActive = pathname.startsWith('/manage/create');
  const isSubscribeActive = pathname.startsWith('/manage/subscribe');

  if (!store.mounted || (!store.isOpen && !store.isClosing)) return null;

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex justify-end ${
        store.isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
    >
      <div className='flex-1' onClick={onClose} />

      <div
        className={`w-3/4 sm:w-2/5 h-full bg-background border-l border-border shadow-xl p-4 space-y-2 overflow-y-auto ${
          store.isClosing ? 'animate-slide-out' : 'animate-slide-in'
        }`}
      >
        <NavLinks isMobile onLinkClick={onClose} />

        {session.isLoggedIn && (
          <div ref={refs.manageMenuRef} className='border-t border-border pt-2'>
            <button
              onClick={store.toggleManageOpen}
              className={`w-full text-left font-semibold mb-1 px-4 py-2 ${
                isManageActive ? 'text-primary' : 'text-foreground/70'
              }`}
            >
              Manage
            </button>

            {store.isManageOpen && (
              <div className='pl-2 space-y-3 animate-accordion-down animate-fade-in'>
                {/* Create Section */}
                <div ref={refs.createMenuRef}>
                  <button
                    onClick={store.toggleCreateOpen}
                    className={`w-full text-left font-semibold mb-1 px-2 py-2 ${
                      isCreateActive ? 'text-primary' : 'text-foreground/70'
                    }`}
                  >
                    Create
                  </button>

                  {store.isCreateOpen && (
                    <div className='pl-4 space-y-1 animate-accordion-down animate-fade-in'>
                      {NAV_LINKS.create.map(link => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={
                            pathname === link.href
                              ? STYLES.activeMenuItem
                              : STYLES.menuItem
                          }
                          onClick={onClose}
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
                          onClick={onClose}
                        >
                          Register User (Admin)
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Enroll Section */}
                <div ref={refs.subscribeMenuRef}>
                  <button
                    onClick={store.toggleSubscribeOpen}
                    className={`w-full text-left font-semibold mb-1 px-2 py-2 ${
                      isSubscribeActive ? 'text-primary' : 'text-foreground/70'
                    }`}
                  >
                    Enroll
                  </button>

                  {store.isSubscribeOpen && (
                    <div className='pl-4 space-y-1 animate-accordion-down animate-fade-in'>
                      {NAV_LINKS.enroll.map(link => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={
                            pathname === link.href
                              ? STYLES.activeMenuItem
                              : STYLES.menuItem
                          }
                          onClick={onClose}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delete Section (FIXED) */}
                <div>
                  <p className='font-semibold px-2 py-1'>Delete</p>
                  <div className='pl-4 space-y-1 animate-accordion-down animate-fade-in'>
                    {NAV_LINKS.delete.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={
                          pathname === link.href
                            ? STYLES.activeMenuItem
                            : STYLES.menuItem
                        }
                        onClick={onClose}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <Link
          href='/about'
          className={`${
            pathname === '/about' ? STYLES.activeMenuItem : STYLES.menuItem
          } border-t border-border`}
          onClick={onClose}
        >
          About
        </Link>

        <div className='border-t border-border pt-4 mt-2'>
          <AuthButtons session={session} onLogout={onLogout} isMobile />
        </div>
      </div>
    </div>
  );
};
