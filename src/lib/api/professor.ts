import { Professor, ProfessorCreationData } from '@/types';
import { API_BASE_URL } from './client';

/* -------------------------------------------------------------------------- */
/* PROFESSORS                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Fetches a list of all professors.
 * @returns A promise that resolves to an array of Professor objects.
 */
export async function getProfessors(): Promise<Professor[]> {
  const response = await fetch(`${API_BASE_URL}/professors`);
  if (!response.ok) throw new Error('Failed to fetch professors');
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
    body: JSON.stringify(professorData), // Send the full object
  });

  if (!response.ok) throw new Error('Failed to create professor');
  return response.json();
}
