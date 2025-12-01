'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import useTokenStore from '@/stores/TokenStore';
import { API_BASE_URL } from '@/lib/api/client';
import { DialogPopup } from '@/components';

export function useFetchWithAuth() {
  const { tokenResponse, setTokenResponse } = useTokenStore();
  const router = useRouter();
  const token = tokenResponse?.token;

  const fetchWithAuth = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_BASE_URL}${path}`;

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle Token Expiration / Unauthorized Access
      if (response.status === 401 || response.status === 403) {
        let errorMessage = 'Unauthorized access';

        try {
          const errorData = await response.clone().json();
          console.log('Server Error Response:', errorData);

          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          console.error('Failed to parse error JSON:', e);
        }

        setTokenResponse({ token: '', userId: 0, name: '', role: '' });

        DialogPopup.error(errorMessage);

        router.push('/authentication/login');
      }

      return response;
    },
    [token, router, setTokenResponse],
  );

  return fetchWithAuth;
}
