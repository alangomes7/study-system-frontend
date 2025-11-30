import { TokenResponse } from '@/types';
import { create } from 'zustand';

interface TokenStore {
  tokenResponse: TokenResponse;
  setTokenResponse: (newTokenResponse: TokenResponse) => void;
}

const useTokenStore = create<TokenStore>(set => ({
  tokenResponse: { token: '', userId: 0, name: '', role: '' },
  setTokenResponse: (newTokenResponse: TokenResponse) =>
    set(() => ({ tokenResponse: newTokenResponse })),
}));
export default useTokenStore;
