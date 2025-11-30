import { TokenResponse } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TokenStore {
  tokenResponse: TokenResponse;
  setTokenResponse: (newTokenResponse: TokenResponse) => void;
}

const useTokenStore = create<TokenStore>()(
  persist(
    set => ({
      tokenResponse: { token: '', userId: 0, name: '', role: '' },
      setTokenResponse: (newTokenResponse: TokenResponse) =>
        set(() => ({ tokenResponse: newTokenResponse })),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useTokenStore;
