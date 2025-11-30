import { useRouter } from 'next/navigation';
import useTokenStore from '@/stores/TokenStore';
import { SessionData } from '../../types/types';

export const useNavSession = (): SessionData & { logout: () => void } => {
  const router = useRouter();
  const { tokenResponse, setTokenResponse } = useTokenStore();
  const { name, role, token } = tokenResponse;

  const isLoggedIn = !!token;
  const isAdmin = role === 'ADMIN';

  const logout = () => {
    setTokenResponse({ token: '', userId: 0, name: '', role: '' });
    router.push('/authentication/login');
  };

  return { name, isLoggedIn, isAdmin, logout };
};
