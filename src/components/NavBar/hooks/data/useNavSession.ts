import { useRouter } from 'next/navigation';
import useTokenStore from '@/stores/TokenStore';
import { SessionData } from '../../types/types';
import { useNavUiStore } from '../../stores/useNavUiStore';

export const useNavSession = () => {
  const router = useRouter();
  const { tokenResponse, setTokenResponse } = useTokenStore();
  const { closeAllMenus } = useNavUiStore();

  const { name, role, token } = tokenResponse;
  const isLoggedIn = !!token;
  const isAdmin = role === 'ADMIN';

  const logout = () => {
    setTokenResponse({ token: '', userId: 0, name: '', role: '' });
    router.push('/authentication/login');
    closeAllMenus();
  };

  const session: SessionData = { name, isLoggedIn, isAdmin };

  return { session, logout };
};
