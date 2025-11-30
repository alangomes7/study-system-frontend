import { create } from 'zustand';

interface NavUiState {
  isOpen: boolean;
  isCreateOpen: boolean;
  isManageOpen: boolean;
  isSubscribeOpen: boolean;
  isClosing: boolean;
  isMobile: boolean;
  mounted: boolean;

  // Actions
  setIsOpen: (value: boolean) => void;
  toggleCreateOpen: () => void;
  setCreateOpen: (value: boolean) => void;
  toggleManageOpen: () => void;
  setManageOpen: (value: boolean) => void;
  toggleSubscribeOpen: () => void;
  setSubscribeOpen: (value: boolean) => void;
  setIsClosing: (value: boolean) => void;
  setIsMobile: (value: boolean) => void;
  setMounted: (value: boolean) => void;

  // Complex Actions
  closeAllMenus: () => void;
}

export const useNavUiStore = create<NavUiState>(set => ({
  isOpen: false,
  isCreateOpen: false,
  isManageOpen: false,
  isSubscribeOpen: false,
  isClosing: false,
  isMobile: false,
  mounted: false,

  setIsOpen: value => set({ isOpen: value }),

  toggleCreateOpen: () => set(state => ({ isCreateOpen: !state.isCreateOpen })),
  setCreateOpen: value => set({ isCreateOpen: value }),

  toggleManageOpen: () => set(state => ({ isManageOpen: !state.isManageOpen })),
  setManageOpen: value => set({ isManageOpen: value }),

  toggleSubscribeOpen: () =>
    set(state => ({ isSubscribeOpen: !state.isSubscribeOpen })),
  setSubscribeOpen: value => set({ isSubscribeOpen: value }),

  setIsClosing: value => set({ isClosing: value }),
  setIsMobile: value => set({ isMobile: value }),
  setMounted: value => set({ mounted: value }),

  closeAllMenus: () =>
    set({
      isOpen: false,
      isCreateOpen: false,
      isManageOpen: false,
      isSubscribeOpen: false,
      isClosing: false,
    }),
}));
