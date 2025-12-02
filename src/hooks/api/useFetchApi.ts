'use client';

import { useFetchWithAuth } from './useFetchWithAuth';
import { useCallback } from 'react';
import { API_BASE_URL } from '@/lib/api/client';
import { ErrorResponseApp } from '@/types/ErrorResponseApp';
import { ApiError } from '@/lib/api/ApiError';

// Helper to handle the response and throw structured errors
const handleResponse = async <R>(response: Response): Promise<R> => {
  if (response.status === 204) {
    return {} as R;
  }

  // Attempt to parse JSON regardless of status
  // We use .catch() to return null if the body is empty or invalid JSON
  const data = await response.json().catch(() => null);

  // Handle Errors (4xx, 5xx)
  if (!response.ok) {
    let errorData: ErrorResponseApp;

    if (data && typeof data === 'object' && 'status' in data) {
      errorData = data as ErrorResponseApp;
    } else {
      errorData = {
        status: response.status,
        error: response.statusText,
        message: data?.message || `Request failed: ${response.statusText}`,
        method: 'UNKNOWN', // We don't have access to method in handleResponse easily without passing it
        path: response.url,
        timestamp: new Date().toISOString(),
        fieldErrors: {},
      };
    }

    // Throw the custom ApiError containing the structured data
    throw new ApiError(errorData);
  }

  return data as R;
};

/**
 * Generic hook for interacting with RESTful API endpoints on the client side.
 * @param endpoint - The base endpoint (e.g., '/students')
 */
export function useFetchApi<T, TInput = Partial<T>>(endpoint: string) {
  const fetchWithAuth = useFetchWithAuth();

  const baseUrl = `${API_BASE_URL}${endpoint}`;

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
    baseUrl,
  };
}
