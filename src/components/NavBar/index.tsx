'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon, XIcon } from 'lucide-react';
import { ButtonTheme } from '@/components';

// Hooks
import { useNavState } from './hooks/data/useNavState';
import { useNavSession } from './hooks/data/useNavSession';
import { useMenuLogic } from './hooks/handler/useMenuLogic';

// Components
import { DesktopNav } from './subcomponents/DesktopNav';
import { MobileNav } from './subcomponents/MobileNav';

export default function NavBar() {
  // 1. Data Hooks
  const {
    isOpen,
    setIsOpen,
    isCreateOpen,
    setIsCreateOpen,
    isManageOpen,
    setIsManageOpen,
    isSubscribeOpen,
    setIsSubscribeOpen,
    isClosing,
    setIsClosing,
    mounted,
    isMobile,
  } = useNavState();

  const { name, isLoggedIn, isAdmin, logout } = useNavSession();
  const pathname = usePathname();

  // Aggregate state for passing down
  const navState = {
    isOpen,
    isCreateOpen,
    isManageOpen,
    isSubscribeOpen,
    isClosing,
    mounted,
    isMobile,
  };
  const session = { name, isLoggedIn, isAdmin };

  // 2. Handler Hooks
  const { handleCloseMenu, handleLogout, refs } = useMenuLogic({
    state: navState,
    setters: {
      setIsOpen,
      setIsClosing,
      setIsCreateOpen,
      setIsManageOpen,
      setIsSubscribeOpen,
    },
    logout,
  });

  const navActions = {
    setIsOpen,
    setIsCreateOpen,
    setIsManageOpen,
    setIsSubscribeOpen,
    handleCloseMenu,
    handleLogout,
  };

  return (
    <nav
      ref={refs.navRef}
      className='relative bg-background border-b border-border z-50'
    >
      <div className='flex items-center justify-between p-4'>
        {/* Brand & Theme */}
        <div className='flex items-center space-x-4'>
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

        {/* Desktop Navigation */}
        <DesktopNav
          session={session}
          state={navState}
          actions={navActions}
          refs={refs}
        />

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

      {/* Mobile Drawer */}
      <MobileNav
        session={session}
        state={navState}
        actions={navActions}
        refs={refs}
      />
    </nav>
  );
}
