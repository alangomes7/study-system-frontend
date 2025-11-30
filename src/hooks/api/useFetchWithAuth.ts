'use client';

import useLoginStore from '@/stores/loginStore';
import useTokenStore from '@/stores/TokenStore';
import { useRouter } from 'next/navigation';

const useFetchWithAuth = () => {
  const setLoginInvalido = useLoginStore(s => s.setInvalidLogin);
  const setMsg = useLoginStore(s => s.setMsg);
  const tokenResponse = useTokenStore(s => s.tokenResponse);
  const setTokenResponse = useTokenStore(s => s.setTokenResponse);

  const router = useRouter();

  const fetchWithAuth = async (url: string, options?: RequestInit) => {
    const token = tokenResponse.token;

    let newHeaders: Record<string, string> = {};

    if (options && options.headers) {
      const headers = options.headers as Record<string, string>;
      newHeaders = { ...headers };
    }

    if (token) {
      newHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Merge options with new headers
    const finalOptions = {
      ...(options || {}),
      headers: newHeaders,
    };

    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      console.log('Ocorreu um erro com status = ', response.status);

      if (response.status === 401 || response.status === 403) {
        setLoginInvalido(true);
        setMsg(
          response.status === 401
            ? 'É preciso efetuar login para acessar este recurso.'
            : 'Você não tem permissão para acessar este recurso.',
        );
        // UPDATE THIS LINE: Use correct keys for reset
        setTokenResponse({ token: '', userId: 0, name: '', role: '' });

        router.push('/authentication/login');
      } else {
        const errorData = await response.json().catch(() => null);

        if (errorData && Object.keys(errorData).length > 0) {
          throw errorData;
        } else {
          throw new Error(
            `Erro desconhecido - Status code: ${response.status}`,
          );
        }
      }
    }
    return response;
  };

  return { fetchWithAuth };
};

export default useFetchWithAuth;
