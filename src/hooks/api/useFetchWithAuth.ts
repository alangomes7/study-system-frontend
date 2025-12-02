'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import useTokenStore from '@/stores/TokenStore';
import { API_BASE_URL } from '@/lib/api/client';
import { DialogPopup } from '@/components';
import { ApiError } from '@/lib/api';

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

      // Handle Token Expiration / Unauthorized Access (Global Handler)
      if (response.status === 401 || response.status === 403) {
        const errorData = await response
          .clone()
          .json()
          .catch(() => ({}));

        if (response.status === 401) {
          setTokenResponse({ token: '', userId: 0, name: '', role: '' });
          DialogPopup.error('Session expired. Please login again.');
          router.push('/authentication/login');
        }

        if (response.status === 403) {
          DialogPopup.error(errorData.message || 'Unauthorized Access');
        }

        throw new ApiError(
          errorData && errorData.status
            ? errorData
            : {
                status: response.status,
                message: errorData.message || 'Unauthorized',
                error: response.statusText || 'Unauthorized',
                timestamp: new Date().toISOString(),
                path: url,
                method: options.method || 'GET',
                fieldErrors: {},
              },
        );
      }

      return response;
    },
    [token, router, setTokenResponse],
  );

  return fetchWithAuth;
}
