'use client';

import { useCallback } from 'react';
import useFetchWithAuth from './useFetchWithAuth';
import { API_BASE_URL } from '@/lib/api/client';

/**
 * Generic hook for interacting with RESTful API endpoints.
 * @param endpoint The base endpoint (e.g., '/students', '/courses').
 */
const useApi = <T>(endpoint: string) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const baseUrl = `${API_BASE_URL}${endpoint}`;

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      // 401/403 are handled by fetchWithAuth usually, but we check here too
      const errorData = await response.json().catch(() => null);
      if (errorData && errorData.message) {
        throw new Error(errorData.message);
      } else {
        throw new Error(
          `Request failed: ${response.statusText} (${response.status})`,
        );
      }
    }
    if (response.status === 204) return null;
    return response.json();
  };

  const findAll = useCallback(
    async (params?: Record<string, string | number | boolean>) => {
      let url = baseUrl;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url += `/${searchParams.toString()}`;
      }
      const response = await fetchWithAuth(url);
      console.log(url);
      return handleResponse(response);
    },
    [baseUrl, fetchWithAuth],
  );

  const findById = useCallback(
    async (id: number | string) => {
      const response = await fetchWithAuth(`${baseUrl}/${id}`);
      return handleResponse(response);
    },
    [baseUrl, fetchWithAuth],
  );

  const create = useCallback(
    async (data: any) => {
      const response = await fetchWithAuth(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    [baseUrl, fetchWithAuth],
  );

  const update = useCallback(
    async (id: number | string, data: any) => {
      const response = await fetchWithAuth(`${baseUrl}/${id}`, {
        method: 'PUT', // Defaulting to PUT for updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    [baseUrl, fetchWithAuth],
  );

  const remove = useCallback(
    async (id: number | string) => {
      const response = await fetchWithAuth(`${baseUrl}/${id}`, {
        method: 'DELETE',
      });
      return handleResponse(response);
    },
    [baseUrl, fetchWithAuth],
  );

  return {
    findAll,
    findById,
    create,
    update,
    remove,
    fetchWithAuth, // Expose for custom calls if needed
    baseUrl,
  };
};

export default useApi;
