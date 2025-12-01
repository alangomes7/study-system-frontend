'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import useTokenStore from '@/stores/TokenStore';
import { API_BASE_URL } from '@/lib/api/client';
import { toast } from 'react-toastify';

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
          // Attempt to parse the server error message
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Keep default message if parsing fails
        }

        // Display the error using ToastNotifications (via react-toastify)
        toast.error(errorMessage);

        // 1. Clear the global store so NavBar updates immediately
        setTokenResponse({ token: '', userId: 0, name: '', role: '' });

        // 2. Redirect to login
        router.push('/authentication/login');

        // 3. Return a never-resolving promise to prevent the error page from showing
        //    This effectively halts the request flow while the redirect happens.
        return new Promise<Response>(() => {});
      }

      return response;
    },
    [token, router, setTokenResponse],
  );

  return fetchWithAuth;
}
