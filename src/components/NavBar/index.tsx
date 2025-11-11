'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { MenuIcon, XIcon } from 'lucide-react';
import { ButtonTheme } from '@/components';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  // State for closing animation
  const [isClosing, setIsClosing] = useState(false);
  const animationDuration = 500;

  // --- mounted state ---
  const [mounted, setMounted] = useState(false);
  // Default to false (desktop) to match server render
  const [isMobile, setIsMobile] = useState(false);

  const createMenuRef = useRef<HTMLDivElement>(null);
  const manageMenuRef = useRef<HTMLDivElement>(null);
  const subscribeMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // --- Get current path ---
  const pathname = usePathname();

  // --- Set mounted and THEN check mobile ---
  useEffect(() => {
    setMounted(true); // Signal client mount

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCloseMenu = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setIsCreateOpen(false);
      setIsManageOpen(false);
      setIsSubscribeOpen(false);
    }, animationDuration);
  }, [isClosing]);

  // Handle click outside (for menus)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target as Node)
      ) {
        setIsCreateOpen(false);
      }
      if (
        subscribeMenuRef.current &&
        !subscribeMenuRef.current.contains(event.target as Node)
      ) {
        setIsSubscribeOpen(false);
      }
      if (
        manageMenuRef.current &&
        !manageMenuRef.current.contains(event.target as Node)
      ) {
        setIsManageOpen(false);
      }
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        handleCloseMenu();
      }
    }

    if (mounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mounted, isOpen, handleCloseMenu]);

  // --- Base and Active Link Styles ---
  const navLinkClass =
    'text-sm font-medium text-foreground/80 hover:text-foreground transition-all px-3 py-2 rounded-md hover:bg-foreground/5';
  const menuItemClass =
    'block px-4 py-2 text-sm text-foreground hover:bg-foreground/10 rounded-md';

  // --- Active class styles ---
  const activeNavLinkClass =
    'text-sm font-medium text-primary font-semibold transition-all bg-primary/10 px-3 py-2 rounded-md';
  const activeMenuItemClass =
    'block px-4 py-2 text-sm text-primary bg-primary/10 rounded-md';

  // --- Logic for active dropdowns ---
  const isManageActive = pathname.startsWith('/manage');
  const isCreateActive = pathname.startsWith('/manage/create');
  const isSubscribeActive = pathname.startsWith('/manage/subscribe');

  return (
    <nav
      ref={navRef}
      className='relative bg-background border-b border-border z-50'
    >
      <div className='flex items-center justify-between p-4'>
        {/* Left section */}
        <div className='flex items-center space-x-4'>
          <ButtonTheme />
          <Link
            href='/'
            // --- Conditional style for Home ---
            className={
              pathname === '/'
                ? 'text-lg font-bold text-primary transition-colors'
                : 'text-lg font-bold text-foreground transition-colors'
            }
          >
            StudySystem
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center space-x-2'>
          {' '}
          <Link
            href='/courses'
            // --- Conditional style ---
            className={
              pathname.startsWith('/courses')
                ? activeNavLinkClass
                : navLinkClass
            }
          >
            Courses
          </Link>
          <Link
            href='/professors'
            // --- Conditional style ---
            className={
              pathname.startsWith('/professors')
                ? activeNavLinkClass
                : navLinkClass
            }
          >
            Professors
          </Link>
          <Link
            href='/students'
            // --- Conditional style ---
            className={
              pathname.startsWith('/students')
                ? activeNavLinkClass
                : navLinkClass
            }
          >
            Students
          </Link>
          <Link
            href='/study-classes'
            // --- Conditional style ---
            className={
              pathname.startsWith('/study-classes')
                ? activeNavLinkClass
                : navLinkClass
            }
          >
            Study Classes
          </Link>
          <div
            ref={manageMenuRef}
            className='relative'
            onMouseEnter={() => !isMobile && setIsManageOpen(true)}
            onMouseLeave={() => !isMobile && setIsManageOpen(false)}
          >
            <button
              onClick={() => isMobile && setIsManageOpen(!isManageOpen)}
              // --- active logic ---
              className={`${
                isManageActive ? activeNavLinkClass : navLinkClass
              } w-full`}
            >
              Manage
            </button>

            {/* Dropdown Content */}
            {isManageOpen && (
              <div className='absolute right-0 w-56 bg-card-background border border-border rounded-md shadow-lg py-1 p-1 z-50 animate-dropdown-in'>
                <p className='px-4 py-2 text-xs font-semibold text-foreground/60'>
                  Create
                </p>
                <Link
                  href='/manage/create/student'
                  className={
                    pathname === '/manage/create/student'
                      ? activeMenuItemClass
                      : menuItemClass
                  }
                >
                  Create Student
                </Link>
                <Link
                  href='/manage/create/professor'
                  className={
                    pathname === '/manage/create/professor'
                      ? activeMenuItemClass
                      : menuItemClass
                  }
                >
                  Create Professor
                </Link>
                <Link
                  href='/manage/create/course'
                  className={
                    pathname === '/manage/create/course'
                      ? activeMenuItemClass
                      : menuItemClass
                  }
                >
                  Create Course
                </Link>
                <Link
                  href='/manage/create/study-class'
                  className={
                    pathname === '/manage/create/study-class'
                      ? activeMenuItemClass
                      : menuItemClass
                  }
                >
                  Create Study Class
                </Link>
                <Link
                  href='/manage/create/study-class/student-group'
                  className={
                    pathname === '/manage/create/study-class/student-group'
                      ? activeMenuItemClass
                      : menuItemClass
                  }
                >
                  Student Groups
                </Link>
                <div className='my-1 border-t border-border' />
                <p className='px-4 py-2 text-xs font-semibold text-foreground/60'>
                  Subscribe
                </p>
                <Link
                  href='/manage/subscribe/students'
                  className={
                    pathname === '/manage/subscribe/students'
                      ? activeMenuItemClass
                      : menuItemClass
                  }
                >
                  Enroll Student
                </Link>
              </div>
            )}
          </div>
          <Link
            href='/about'
            // --- Conditional style ---
            className={pathname == '/about' ? activeNavLinkClass : navLinkClass}
          >
            About
          </Link>
        </div>

        <div className='hidden md:block'>
          <Link
            href='/login'
            // --- Conditional style ---
            className={`btn btn-primary ${
              pathname === '/login' ? 'opacity-75' : ''
            }`}
          >
            Login
          </Link>
        </div>

        {/* ... Mobile menu button ... */}
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

      {/* --- Mobile Menu Drawer --- */}
      {mounted && (isOpen || isClosing) && (
        <div
          className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-xs flex justify-end ${
            isClosing ? 'animate-fade-out' : 'animate-fade-in'
          }`}
        >
          <div className='flex-1' onClick={handleCloseMenu} />

          <div
            className={`w-3/4 sm:w-2/5 h-full bg-background border-l border-border shadow-xl p-4 space-y-2 overflow-y-auto ${
              isClosing ? 'animate-slide-out' : 'animate-slide-in'
            }`}
          >
            <Link
              href='/courses'
              className={
                pathname.startsWith('/courses')
                  ? activeMenuItemClass
                  : menuItemClass
              }
              onClick={handleCloseMenu}
            >
              Courses
            </Link>
            <Link
              href='/professors'
              className={
                pathname.startsWith('/professors')
                  ? activeMenuItemClass
                  : menuItemClass
              }
              onClick={handleCloseMenu}
            >
              Professors
            </Link>
            <Link
              href='/students'
              className={
                pathname.startsWith('/students')
                  ? activeMenuItemClass
                  : menuItemClass
              }
              onClick={handleCloseMenu}
            >
              Students
            </Link>
            <Link
              href='/study-classes'
              className={
                pathname.startsWith('/study-classes')
                  ? activeMenuItemClass
                  : menuItemClass
              }
              onClick={handleCloseMenu}
            >
              Study Classes
            </Link>

            <div ref={manageMenuRef} className='border-t border-border pt-2'>
              <button
                onClick={() => setIsManageOpen(!isManageOpen)}
                className={`w-full text-left font-semibold mb-1 px-4 py-2 ${
                  isManageActive ? 'text-primary' : 'text-foreground/70'
                }`}
              >
                Manage
              </button>

              {isManageOpen && (
                <div className='pl-2 space-y-1 animate-accordion-down animate-fade-in'>
                  {/* --- Create Sub-menu --- */}
                  <div ref={createMenuRef}>
                    <button
                      onClick={() => setIsCreateOpen(!isCreateOpen)}
                      className={`w-full text-left font-semibold mb-1 px-2 py-2 ${
                        isCreateActive ? 'text-primary' : 'text-foreground/70'
                      }`}
                    >
                      Create
                    </button>
                    {isCreateOpen && (
                      <div className='pl-4 space-y-1 animate-accordion-down animate-fade-in'>
                        <Link
                          href='/manage/create/student'
                          className={
                            pathname === '/manage/create/student'
                              ? activeMenuItemClass
                              : menuItemClass
                          }
                          onClick={handleCloseMenu}
                        >
                          Create Student
                        </Link>
                        <Link
                          href='/manage/create/professor'
                          className={
                            pathname === '/manage/create/professor'
                              ? activeMenuItemClass
                              : menuItemClass
                          }
                          onClick={handleCloseMenu}
                        >
                          Create Professor
                        </Link>
                        <Link
                          href='/manage/create/course'
                          className={
                            pathname === '/manage/create/course'
                              ? activeMenuItemClass
                              : menuItemClass
                          }
                          onClick={handleCloseMenu}
                        >
                          Create Course
                        </Link>
                        <Link
                          href='/manage/create/study-class'
                          className={
                            pathname === '/manage/create/study-class'
                              ? activeMenuItemClass
                              : menuItemClass
                          }
                          onClick={handleCloseMenu}
                        >
                          Create Study Class
                        </Link>
                        <Link
                          href='/manage/create/study-class/student-group'
                          className={
                            pathname ===
                            '/manage/create/study-class/student-group'
                              ? activeMenuItemClass
                              : menuItemClass
                          }
                          onClick={handleCloseMenu}
                        >
                          Student Groups
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* --- Subscribe Sub-menu --- */}
                  <div ref={subscribeMenuRef}>
                    <button
                      onClick={() => setIsSubscribeOpen(!isSubscribeOpen)}
                      className={`w-full text-left font-semibold mb-1 px-2 py-2 ${
                        isSubscribeActive
                          ? 'text-primary'
                          : 'text-foreground/70'
                      }`}
                    >
                      Subscribe
                    </button>
                    {isSubscribeOpen && (
                      <div className='pl-4 space-y-1 animate-accordion-down animate-fade-in'>
                        <Link
                          href='/manage/subscribe/students'
                          className={
                            pathname === '/manage/subscribe/students'
                              ? activeMenuItemClass
                              : menuItemClass
                          }
                          onClick={handleCloseMenu}
                        >
                          Enroll Student
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href='/about'
              // --- Conditional style ---
              className={`${
                pathname == '/about' ? activeMenuItemClass : menuItemClass
              } border-t border-border`}
              onClick={handleCloseMenu}
            >
              About
            </Link>

            <div className='border-t border-border pt-2'>
              <Link
                href='/login'
                className='btn btn-primary w-full'
                onClick={handleCloseMenu}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
