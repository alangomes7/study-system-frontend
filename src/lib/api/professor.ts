import { Professor, ProfessorCreationData } from '@/types';
import { API_BASE_URL } from './client';
import { throwApiError } from './throwApiError';

/**
 * Fetches a list of all professors.
 * @returns A promise that resolves to an array of Professor objects.
 */
export async function getProfessors(): Promise<Professor[]> {
  const response = await fetch(`${API_BASE_URL}/professors`);

  if (!response.ok) {
    await throwApiError(response);
  }

  return response.json();
}

/**
 * Creates a new professor.
 * @param professorData The data for the new professor.
 * @returns A promise that resolves to the newly created Professor object.
 */
export async function createProfessor(
  professorData: ProfessorCreationData,
): Promise<Professor> {
  const response = await fetch(`${API_BASE_URL}/professors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professorData),
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  return response.json();
}

/**
 * Fetches details for a single professor by ID.
 * @param id The ID of the professor to fetch.
 * @returns A promise that resolves to the Professor object.
 */
export async function getProfessor(id: number): Promise<Professor> {
  const response = await fetch(`${API_BASE_URL}/professors/${id}`);

  if (!response.ok) {
    await throwApiError(response);
  }

  return response.json();
}

/**
 * Updates an existing professor by ID.
 * @param id The ID of the professor to update.
 * @param professorData The data to update the professor with.
 * @returns A promise that resolves to the updated Professor object.
 */
export async function updateProfessor(
  id: number,
  professorData: ProfessorCreationData,
): Promise<Professor> {
  const response = await fetch(`${API_BASE_URL}/professors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professorData),
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  return response.json();
}
