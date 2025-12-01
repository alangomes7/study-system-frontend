'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon, XIcon } from 'lucide-react';
import { ButtonTheme } from '@/components';

// 1. Hooks
import { useNavSession } from './hooks/data/useNavSession';
import { useMenuHandler } from './hooks/handler/useMenuHandler';
import { useNavUiStore } from './stores/useNavUiStore';

// 2. Components
import { DesktopNav } from './subcomponents/DesktopNav';
import { MobileNav } from './subcomponents/MobileNav';
import { AuthButtons } from './subcomponents/AuthButtons';

export default function NavBar() {
  const pathname = usePathname();

  // Zustand Store for UI State
  const { isOpen, setIsOpen, mounted } = useNavUiStore();

  // Custom Hooks
  const { session, logout } = useNavSession();
  const { handleCloseMenu, refs } = useMenuHandler();

  return (
    <nav
      ref={refs.navRef}
      className='relative bg-background border-b border-border z-50'
    >
      <div className='flex items-center justify-between p-4 min-h-[72px]'>
        {/* Left Side: Brand & Theme */}
        <div className='flex items-center space-x-4 z-10'>
          <ButtonTheme />
          <Link
            href='/'
            className={
              pathname === '/'
                ? 'text-lg font-bold text-primary transition-colors'
                : 'text-lg font-bold text-foreground transition-colors'
            }
          >
            StudySystem
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className='hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <DesktopNav session={session} refs={refs} />
        </div>

        {/* Right Side: Auth & Mobile Toggle */}
        <div className='flex items-center gap-4 z-10'>
          {/* Desktop Auth Buttons */}
          <div className='hidden md:block'>
            <AuthButtons session={session} onLogout={logout} />
          </div>

          {/* Mobile Toggle Button */}
          <div className='md:hidden'>
            {!mounted ? (
              <div className='h-6 w-6' />
            ) : (
              <button
                onClick={() => (isOpen ? handleCloseMenu() : setIsOpen(true))}
                className='text-foreground focus:outline-none'
              >
                {isOpen ? (
                  <XIcon className='h-6 w-6' />
                ) : (
                  <MenuIcon className='h-6 w-6' />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        session={session}
        refs={refs}
        onClose={handleCloseMenu}
        onLogout={logout}
      />
    </nav>
  );
}
