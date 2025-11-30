import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLinks } from './NavLinks';
import { AuthButtons } from './AuthButtons';
import { STYLES, NAV_LINKS } from '../types/constants';
import { SessionData, NavState, NavActions, NavRefs } from '../types/types';

interface MobileNavProps {
  session: SessionData;
  state: NavState;
  actions: NavActions;
  refs: NavRefs;
}

export const MobileNav = ({
  session,
  state,
  actions,
  refs,
}: MobileNavProps) => {
  const pathname = usePathname();
  const isManageActive = pathname.startsWith('/manage');

  if (!state.mounted || (!state.isOpen && !state.isClosing)) return null;

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex justify-end ${
        state.isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
    >
      <div className='flex-1' onClick={actions.handleCloseMenu} />

      <div
        className={`w-3/4 sm:w-2/5 h-full bg-background border-l border-border shadow-xl p-4 space-y-2 overflow-y-auto ${
          state.isClosing ? 'animate-slide-out' : 'animate-slide-in'
        }`}
      >
        <NavLinks isMobile onLinkClick={actions.handleCloseMenu} />

        {session.isLoggedIn && (
          <div ref={refs.manageMenuRef} className='border-t border-border pt-2'>
            <button
              onClick={() => actions.setIsManageOpen(!state.isManageOpen)}
              className={`w-full text-left font-semibold mb-1 px-4 py-2 ${
                isManageActive ? 'text-primary' : 'text-foreground/70'
              }`}
            >
              Manage
            </button>

            {state.isManageOpen && (
              <div className='pl-2 space-y-1 animate-accordion-down animate-fade-in'>
                {/* Create Accordion */}
                <div ref={refs.createMenuRef}>
                  <button
                    onClick={() => actions.setIsCreateOpen(!state.isCreateOpen)}
                    className='w-full text-left font-semibold mb-1 px-2 py-2 text-foreground/70'
                  >
                    Create
                  </button>
                  {state.isCreateOpen && (
                    <div className='pl-4 space-y-1 animate-accordion-down animate-fade-in'>
                      {NAV_LINKS.create.map(link => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={actions.handleCloseMenu}
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
                          onClick={actions.handleCloseMenu}
                          className={
                            pathname === '/manage/create/user'
                              ? STYLES.activeMenuItem
                              : STYLES.menuItem
                          }
                        >
                          Register User (Admin)
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Enroll Accordion */}
                <div ref={refs.subscribeMenuRef}>
                  <button
                    onClick={() =>
                      actions.setIsSubscribeOpen(!state.isSubscribeOpen)
                    }
                    className='w-full text-left font-semibold mb-1 px-2 py-2 text-foreground/70'
                  >
                    Enroll
                  </button>
                  {state.isSubscribeOpen && (
                    <div className='pl-4 space-y-1 animate-accordion-down animate-fade-in'>
                      {NAV_LINKS.enroll.map(link => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={actions.handleCloseMenu}
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
              </div>
            )}
          </div>
        )}

        <Link
          href='/about'
          className={`${
            pathname === '/about' ? STYLES.activeMenuItem : STYLES.menuItem
          } border-t border-border`}
          onClick={actions.handleCloseMenu}
        >
          About
        </Link>

        <div className='border-t border-border pt-4 mt-2'>
          <AuthButtons
            session={session}
            onLogout={actions.handleLogout}
            isMobile
          />
        </div>
      </div>
    </div>
  );
};
