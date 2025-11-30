'use client';

import { useFetchWithAuth } from './useFetchWithAuth';
import { useCallback } from 'react';

// Defined OUTSIDE the hook to avoid dependency array issues
const handleResponse = async <R>(response: Response): Promise<R> => {
  // Handle 204 No Content
  if (response.status === 204) return null as R;

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Generic hook for interacting with RESTful API endpoints on the client side.
 * @param endpoint - The base endpoint (e.g., '/students')
 */
export function useFetchApi<T, TInput = Partial<T>>(endpoint: string) {
  const fetchWithAuth = useFetchWithAuth();

  const findAll = useCallback(
    async (params?: Record<string, string | number | boolean>) => {
      let url = endpoint;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url += `?${searchParams.toString()}`;
      }
      const response = await fetchWithAuth(url);
      return handleResponse<T[]>(response);
    },
    [endpoint, fetchWithAuth],
  );

  const findById = useCallback(
    async (id: number | string) => {
      const response = await fetchWithAuth(`${endpoint}/${id}`);
      return handleResponse<T>(response);
    },
    [endpoint, fetchWithAuth],
  );

  const create = useCallback(
    async (data: TInput) => {
      const response = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return handleResponse<T>(response);
    },
    [endpoint, fetchWithAuth],
  );

  const update = useCallback(
    async (id: number | string, data: TInput) => {
      const response = await fetchWithAuth(`${endpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return handleResponse<T>(response);
    },
    [endpoint, fetchWithAuth],
  );

  const remove = useCallback(
    async (id: number | string) => {
      const response = await fetchWithAuth(`${endpoint}/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<void>(response);
    },
    [endpoint, fetchWithAuth],
  );

  return {
    findAll,
    findById,
    create,
    update,
    remove,
    fetchWithAuth,
  };
}
