'use client';

import { useCallback } from 'react';
import fetchWithAuth from './fetchWithAuth';
import { API_BASE_URL } from '@/lib/api/client';

/**
 * Generic hook for interacting with RESTful API endpoints.
 * @param endpoint The base endpoint (e.g., '/students', '/courses').
 * @template T The entity type returned by the API (e.g., Student, Course).
 * @template TInput The type used for create/update payloads (defaults to Partial<T>).
 */
const fecthApi = <T, TInput = Partial<T>>(endpoint: string) => {
  const { fetchWithAuth } = fetchWithAuth();
  const baseUrl = `${API_BASE_URL}${endpoint}`;

  // 1. Wrap handleResponse in useCallback so it has a stable reference
  const handleResponse = useCallback(
    async <R = T>(response: Response): Promise<R> => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.message) {
          throw new Error(errorData.message);
        } else {
          throw new Error(
            `Request failed: ${response.statusText} (${response.status})`,
          );
        }
      }
      // Handle 204 No Content
      if (response.status === 204) return null as R;
      return response.json();
    },
    [],
  );

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
      return handleResponse<T[]>(response);
    },
    // 2. Add handleResponse to dependency array
    [baseUrl, fetchWithAuth, handleResponse],
  );

  const findById = useCallback(
    async (id: number | string) => {
      const response = await fetchWithAuth(`${baseUrl}/${id}`);
      return handleResponse<T>(response);
    },
    [baseUrl, fetchWithAuth, handleResponse],
  );

  const create = useCallback(
    async (data: TInput) => {
      const response = await fetchWithAuth(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<T>(response);
    },
    [baseUrl, fetchWithAuth, handleResponse],
  );

  const update = useCallback(
    async (id: number | string, data: TInput) => {
      const response = await fetchWithAuth(`${baseUrl}/${id}`, {
        method: 'PUT', // Defaulting to PUT for updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<T>(response);
    },
    [baseUrl, fetchWithAuth, handleResponse],
  );

  const remove = useCallback(
    async (id: number | string) => {
      const response = await fetchWithAuth(`${baseUrl}/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<void>(response);
    },
    [baseUrl, fetchWithAuth, handleResponse],
  );

  return {
    findAll,
    findById,
    create,
    update,
    remove,
    fetchWithAuth,
    baseUrl,
  };
};

export default fecthApi;
