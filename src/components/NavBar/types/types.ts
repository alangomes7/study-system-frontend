import { RefObject } from 'react';

// Data derived from the User Session
export interface SessionData {
  name: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

// Refs used for "Click Outside" logic
export interface NavRefs {
  navRef: RefObject<HTMLDivElement | null>;
  createMenuRef: RefObject<HTMLDivElement | null>;
  manageMenuRef: RefObject<HTMLDivElement | null>;
  subscribeMenuRef: RefObject<HTMLDivElement | null>;
}
