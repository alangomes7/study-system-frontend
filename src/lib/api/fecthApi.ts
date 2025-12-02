import { fetchWithAuth } from './fetchWithAuth';
import { API_BASE_URL } from '@/lib/api/client';
import { ApiError } from '@/lib/api/ApiError'; // Ensure path matches your project structure
import { ErrorResponseApp } from '@/types/ErrorResponseApp'; //

/**
 * Server-side generic service for interacting with RESTful API endpoints.
 */
export const createApiService = <T, TInput = Partial<T>>(endpoint: string) => {
  const baseUrl = `${API_BASE_URL}${endpoint}`;

  // Helper to handle response parsing and error throwing
  const handleResponse = async <R = T>(response: Response): Promise<R> => {
    if (response.status === 204) {
      return {} as R;
    }

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
          message: data?.message || 'An unexpected error occurred',
          timestamp: new Date().toISOString(),
          method: 'UNKNOWN',
          path: endpoint,
          fieldErrors: {},
        };
      }

      throw new ApiError(errorData);
    }

    return data as R;
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
