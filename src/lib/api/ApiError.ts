import { ErrorResponseApp } from '@/types/ErrorResponseApp';

export class ApiError extends Error {
  public response: ErrorResponseApp;

  constructor(response: ErrorResponseApp) {
    super(response.message);
    this.name = 'ApiError';
    this.response = response;
  }
}
