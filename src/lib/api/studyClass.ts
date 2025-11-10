import { StudyClass, StudyClassCreationData } from '@/types';
import { API_BASE_URL } from './client';

/**
 * Fetches a list of all study classes.
 * @returns A promise that resolves to an array of StudyClass objects.
 */
export async function getAllStudyClasses(): Promise<StudyClass[]> {
  const response = await fetch(`${API_BASE_URL}/study-classes`);
  if (!response.ok) throw new Error('Failed to fetch study classes');
  return response.json();
}

/**
 * Fetches a single study class by its unique identifier.
 * @param id - The numerical ID of the study class to retrieve.
 * @returns A Promise that resolves to the {@link StudyClass} object.
 * @throws Will throw an Error if the fetch response is not 'ok' (e.g., 404, 500).
 */
export async function getStudyClass(id: number): Promise<StudyClass> {
  const response = await fetch(`${API_BASE_URL}/study-classes/${id}`);
  if (!response.ok)
    throw new Error(`Failed to fetch study class with id ${id}`);
  return response.json();
}

/**
 * Fetches all study classes associated with a specific course.
 * @param courseId The ID of the course.
 * @returns A promise that resolves to an array of StudyClass objects.
 */
export async function getStudyClassesByCourse(
  courseId: string,
): Promise<StudyClass[]> {
  const response = await fetch(
    `${API_BASE_URL}/study-classes/course/${courseId}`,
  );
  if (!response.ok) throw new Error('Failed to fetch study classes');
  return response.json();
}

/**
 * Creates a new study class.
 * @param studyClassData An object containing the new study class's details.
 * @returns A promise that resolves to the newly created StudyClass object.
 */
export async function createStudyClass(
  studyClassData: StudyClassCreationData,
): Promise<StudyClass> {
  const response = await fetch(`${API_BASE_URL}/study-classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studyClassData),
  });

  if (!response.ok) throw new Error('Failed to create study class');
  return response.json();
}

/**
 * Assigns a professor to a specific study class via a PUT request.
 *
 * @param studyClassId - The ID of the study class.
 * @param professorId - The ID of the professor to assign.
 * @returns A Promise that resolves to the updated StudyClass DTO on success.
 * @throws Will throw an Error if the fetch response is not 'ok'.
 */
export async function enrollProfessorInStudyClass(
  studyClassId: string | number,
  professorId: string | number,
): Promise<StudyClass> {
  const response = await fetch(
    `${API_BASE_URL}/study-classes/${studyClassId}/professor`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        professorId: professorId,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to assign professor');
  }
  return response.json();
}
