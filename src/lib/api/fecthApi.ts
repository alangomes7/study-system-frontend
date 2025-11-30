import { fetchWithAuth } from './fetchWithAuth'; // Import your new server-side fetcher
import { API_BASE_URL } from '@/lib/api/client';

/**
 * Server-side generic service for interacting with RESTful API endpoints.
 * @param endpoint The base endpoint (e.g., '/students', '/courses').
 * @template T The entity type returned by the API (e.g., Student, Course).
 * @template TInput The type used for create/update payloads (defaults to Partial<T>).
 */
export const createApiService = <T, TInput = Partial<T>>(endpoint: string) => {
  const baseUrl = `${API_BASE_URL}${endpoint}`;

  // Helper to handle response parsing and error throwing
  const handleResponse = async <R = T>(response: Response): Promise<R> => {
    // Handle 204 No Content immediately
    if (response.status === 204) return null as R;

    // Handle Errors
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

    // Handle JSON success
    return response.json();
  };

  const findAll = async (
    params?: Record<string, string | number | boolean>,
  ) => {
    let url = baseUrl;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    // Pass 'fetchWithAuth' logic implicitly by calling the utility
    const response = await fetchWithAuth(url);
    return handleResponse<T[]>(response);
  };

  const findById = async (id: number | string) => {
    const response = await fetchWithAuth(`${baseUrl}/${id}`);
    return handleResponse<T>(response);
  };

  const create = async (data: TInput) => {
    const response = await fetchWithAuth(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  };

  const update = async (id: number | string, data: TInput) => {
    const response = await fetchWithAuth(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  };

  const remove = async (id: number | string) => {
    const response = await fetchWithAuth(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  };

  return {
    findAll,
    findById,
    create,
    update,
    remove,
    baseUrl,
  };
};

export default createApiService;
