import { useCallback, useRef, useEffect } from 'react';
import { NavRefs, NavState } from '../../data/types';

interface UseMenuLogicProps {
  state: NavState;
  setters: {
    setIsOpen: (v: boolean) => void;
    setIsClosing: (v: boolean) => void;
    setIsCreateOpen: (v: boolean) => void;
    setIsManageOpen: (v: boolean) => void;
    setIsSubscribeOpen: (v: boolean) => void;
  };
  logout: () => void;
}

export const useMenuLogic = ({ state, setters, logout }: UseMenuLogicProps) => {
  // These create RefObject<HTMLDivElement | null>
  const navRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const manageMenuRef = useRef<HTMLDivElement>(null);
  const subscribeMenuRef = useRef<HTMLDivElement>(null);

  const handleCloseMenu = useCallback(() => {
    if (state.isClosing) return;

    setters.setIsClosing(true);
    setTimeout(() => {
      setters.setIsOpen(false);
      setters.setIsClosing(false);
      setters.setIsCreateOpen(false);
      setters.setIsManageOpen(false);
      setters.setIsSubscribeOpen(false);
    }, 500);
  }, [state.isClosing, setters]);

  const handleLogout = () => {
    logout();
    if (state.isOpen) handleCloseMenu();
  };

  // Click Outside Handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Type guards ensure .current exists before checking .contains
      if (createMenuRef.current && !createMenuRef.current.contains(target)) {
        setters.setIsCreateOpen(false);
      }
      if (
        subscribeMenuRef.current &&
        !subscribeMenuRef.current.contains(target)
      ) {
        setters.setIsSubscribeOpen(false);
      }
      if (manageMenuRef.current && !manageMenuRef.current.contains(target)) {
        setters.setIsManageOpen(false);
      }
      if (navRef.current && !navRef.current.contains(target) && state.isOpen) {
        handleCloseMenu();
      }
    }

    if (state.mounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [state.mounted, state.isOpen, handleCloseMenu, setters]);

  // Now compatible with the updated NavRefs interface
  const refs: NavRefs = {
    navRef,
    createMenuRef,
    manageMenuRef,
    subscribeMenuRef,
  };

  return { handleCloseMenu, handleLogout, refs };
};
