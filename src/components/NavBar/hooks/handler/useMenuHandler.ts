import { useCallback, useEffect, useRef } from 'react';
import { useNavUiStore } from '../../stores/useNavUiStore';
import { NavRefs } from '../../types/types';

export const useMenuHandler = () => {
  // Use the Zustand store
  const store = useNavUiStore();

  // Refs
  const navRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const manageMenuRef = useRef<HTMLDivElement>(null);
  const subscribeMenuRef = useRef<HTMLDivElement>(null);

  // 1. Handle Resize (Mobile/Desktop detection)
  useEffect(() => {
    store.setMounted(true);
    const handleResize = () => store.setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Handle Closing Animation
  const handleCloseMenu = useCallback(() => {
    if (store.isClosing) return;

    store.setIsClosing(true);
    setTimeout(() => {
      store.closeAllMenus();
    }, 300);
  }, [store]);

  // 3. Handle Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (createMenuRef.current && !createMenuRef.current.contains(target)) {
        store.setCreateOpen(false);
      }
      if (
        subscribeMenuRef.current &&
        !subscribeMenuRef.current.contains(target)
      ) {
        store.setSubscribeOpen(false);
      }
      if (manageMenuRef.current && !manageMenuRef.current.contains(target)) {
        store.setManageOpen(false);
      }
      if (navRef.current && !navRef.current.contains(target) && store.isOpen) {
        handleCloseMenu();
      }
    }

    if (store.mounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [store.mounted, store.isOpen, handleCloseMenu]);

  const refs: NavRefs = {
    navRef,
    createMenuRef,
    manageMenuRef,
    subscribeMenuRef,
  };

  return { handleCloseMenu, refs };
};
