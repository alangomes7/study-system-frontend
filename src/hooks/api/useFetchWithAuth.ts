'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import useTokenStore from '@/stores/TokenStore';
import { API_BASE_URL } from '@/lib/api/client';

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
        // 1. Clear the global store so NavBar updates immediately
        setTokenResponse({ token: '', userId: 0, name: '', role: '' });

        // 2. Redirect to login
        router.push('/authentication/login');

        throw new Error('Unauthorized access');
      }

      return response;
    },
    [token, router, setTokenResponse], // Add setTokenResponse to dependency array
  );

  return fetchWithAuth;
}
