import { API_BASE_URL } from './client';
// You will need to define the UserApp type in your @/types folder
import { UserApp } from '@/types';

/**
 * Retrieves a list of all users.
 * @returns A promise that resolves to an array of UserApp entities.
 */
export async function getAllUserApps(): Promise<UserApp[]> {
  const response = await fetch(`${API_BASE_URL}/userApp`);
  if (!response.ok) throw new Error('Failed to fetch users');
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

  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}
