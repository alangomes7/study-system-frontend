import { API_BASE_URL } from './client';
import { UserApp } from '@/types';
import { throwApiError } from './throwApiError'; //

/**
 * Retrieves a list of all users.
 * @returns A promise that resolves to an array of UserApp entities.
 */
export async function getAllUserApps(): Promise<UserApp[]> {
  const response = await fetch(`${API_BASE_URL}/userApp`);
  if (!response.ok) {
    await throwApiError(response);
  }
  return response.json();
}

/**
 * Create a new userApp.
 * @param userAppData The user object to be added.
 * @returns A promise that resolves to the created UserApp entity.
 */
export async function createUserApp(
  userAppData: Omit<UserApp, 'id'>,
): Promise<UserApp> {
  const response = await fetch(`${API_BASE_URL}/userApp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userAppData),
  });

  if (!response.ok) {
    await throwApiError(response);
  }
  return response.json();
}
