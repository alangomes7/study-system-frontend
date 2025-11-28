'use client';

import { FetchPaginated } from '@/types';
import useFetchWithAuth from './useFetchWithAuth';
import { API_BASE_URL } from '@/lib/api/client';

const useApi = <T>(endpoint: string) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const fullUrl = `${API_BASE_URL}${endpoint}`;

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      // If 401/403, fetchWithAuth already handled the redirect.
      // We return here to stop execution if needed, or handle other errors (400, 404, 500)

      const errorData = await response.json().catch(() => null);

      if (errorData && Object.keys(errorData).length > 0) {
        throw errorData;
      } else {
        throw new Error(
          `Unknown error: ${response.statusText} - Status code: ${response.status}`,
        );
      }
    }

    // Return void if 204 No Content, otherwise parse JSON
    if (response.status === 204) return null;
    return await response.json();
  };

  const update = async (obj: T) => {
    const response = await fetchWithAuth(fullUrl, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(obj),
    });

    return handleResponse(response);
  };

  const fetchPaginated = async (
    queryString: Record<string, string | number | boolean>, // Expanded type to accept numbers/booleans
  ): Promise<FetchPaginated<T>> => {
    // Convert all values to strings for URLSearchParams
    const params = new URLSearchParams();
    Object.entries(queryString).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    // Note: Kept '/paginacao' as it likely refers to a specific backend route.
    // Change to '/pagination' only if your API endpoint supports it.
    const response = await fetchWithAuth(
      `${fullUrl}/paginacao?${params.toString()}`,
    );

    return handleResponse(response);
  };

  // Optional: You might want these methods too for a full API hook
  const create = async (obj: T) => {
    const response = await fetchWithAuth(fullUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(obj),
    });
    return handleResponse(response);
  };

  const remove = async (id: number | string) => {
    const response = await fetchWithAuth(`${fullUrl}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  };

  return {
    update,
    fetchPaginated,
    create, // Exporting the new optional method
    remove, // Exporting the new optional method
  };
};

export default useApi;
