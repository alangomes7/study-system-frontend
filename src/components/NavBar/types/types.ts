import { RefObject } from 'react';

export interface NavState {
  isOpen: boolean;
  isCreateOpen: boolean;
  isManageOpen: boolean;
  isSubscribeOpen: boolean;
  isClosing: boolean;
  isMobile: boolean;
  mounted: boolean;
}

export interface NavActions {
  setIsOpen: (v: boolean) => void;
  setIsCreateOpen: (v: boolean) => void;
  setIsManageOpen: (v: boolean) => void;
  setIsSubscribeOpen: (v: boolean) => void;
  handleCloseMenu: () => void;
  handleLogout: () => void;
}

export interface NavRefs {
  navRef: RefObject<HTMLDivElement | null>;
  createMenuRef: RefObject<HTMLDivElement | null>;
  manageMenuRef: RefObject<HTMLDivElement | null>;
  subscribeMenuRef: RefObject<HTMLDivElement | null>;
}
export interface SessionData {
  name: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
}
