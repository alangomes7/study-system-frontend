import { useCallback, useEffect, useRef } from 'react';
import { useNavUiStore } from '../../stores/useNavUiStore';
import { NavRefs } from '../../types/types';

export const useMenuHandler = () => {
  const {
    isClosing,
    isOpen,
    mounted,
    setMounted,
    setIsMobile,
    setIsClosing,
    setCreateOpen,
    setManageOpen,
    setSubscribeOpen,
    closeAllMenus,
  } = useNavUiStore();

  // Refs
  const navRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const manageMenuRef = useRef<HTMLDivElement>(null);
  const subscribeMenuRef = useRef<HTMLDivElement>(null);

  // 1. Handle Resize (Mobile/Desktop detection)
  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMounted, setIsMobile]);

  // 2. Handle Closing Animation
  const handleCloseMenu = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    setTimeout(() => {
      closeAllMenus();
    }, 300);
  }, [isClosing, setIsClosing, closeAllMenus]);

  // 3. Handle Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (createMenuRef.current && !createMenuRef.current.contains(target)) {
        setCreateOpen(false);
      }
      if (
        subscribeMenuRef.current &&
        !subscribeMenuRef.current.contains(target)
      ) {
        setSubscribeOpen(false);
      }
      if (manageMenuRef.current && !manageMenuRef.current.contains(target)) {
        setManageOpen(false);
      }
      if (navRef.current && !navRef.current.contains(target) && isOpen) {
        handleCloseMenu();
      }
    }

    if (mounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [
    mounted,
    isOpen,
    handleCloseMenu,
    setCreateOpen,
    setSubscribeOpen,
    setManageOpen,
  ]);

  const refs: NavRefs = {
    navRef,
    createMenuRef,
    manageMenuRef,
    subscribeMenuRef,
  };

  return { handleCloseMenu, refs };
};
