import { ErrorResponseApp } from '@/types/ErrorResponseApp';
import { ApiError } from './ApiError';

/**
 * Helper to parse error response and throw ApiError
 */
export async function throwApiError(response: Response) {
  const errorBody = await response.json().catch(() => null);

  const errorData: ErrorResponseApp =
    errorBody && errorBody.status
      ? errorBody
      : {
          status: response.status,
          error: response.statusText,
          message: errorBody?.message || 'An unexpected error occurred',
          timestamp: new Date().toISOString(),
          path: response.url,
          method: 'UNKNOWN',
          fieldErrors: {},
        };

  throw new ApiError(errorData);
}
