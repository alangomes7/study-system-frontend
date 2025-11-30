import { API_BASE_URL } from './client';
import { TokenResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE_URL}/authentication/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Invalid credentials');
  }

  return response.json();
}
