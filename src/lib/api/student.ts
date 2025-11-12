import { Student, StudentCreationData, Subscription } from '@/types';
import { API_BASE_URL } from './client';

/**
 * Fetches a list of all students.
 * @returns A promise that resolves to an array of Student objects.
 */
export async function getAllStudents(): Promise<Student[]> {
  const response = await fetch(`${API_BASE_URL}/students`);
  if (!response.ok) throw new Error('Failed to fetch students');
  return response.json();
}

/**
 * Fetches details for a single student by ID.
 * @param id The ID of the student to fetch.
 * @returns A promise that resolves to the Student object.
 */
export async function getStudent(id: number): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/students/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch student with id ${id}`);
  return response.json();
}

/**
 * Creates a new student.
 * @param studentData An object containing the new student's details.
 * @returns A promise that resolves to the newly created Student object.
 */
export async function createStudent(
  studentData: StudentCreationData,
): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) throw new Error('Failed to create student');
  return response.json();
}

/**
 * Updates an existing student.
 * @param id The ID of the student to update.
 * @param studentData The data to update.
 * @returns A promise that resolves to the updated Student object.
 */
export async function updateStudent(
  id: number,
  studentData: StudentCreationData,
): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) throw new Error('Failed to update student');
  return response.json();
}

/**
 * Fetches student details for a list of subscriptions in batches.
 * @param subscriptions An array of Subscription objects.
 * @param batchSize The number of student requests to make in parallel (default: 20).
 * @returns A promise that resolves to an array of Student objects.
 */
export async function getStudentsInBatches(
  subscriptions: Subscription[],
  batchSize = 20,
): Promise<Student[]> {
  // Get unique student IDs from the subscriptions
  const studentIds = [
    ...new Set(
      subscriptions.filter(sub => sub?.studentId).map(sub => sub.studentId),
    ),
  ];

  const allStudents: Student[] = [];

  // Process requests in batches
  for (let i = 0; i < studentIds.length; i += batchSize) {
    const batchIds = studentIds.slice(i, i + batchSize);
    const batchPromises = batchIds.map(id => getStudent(id)); // Use renamed getStudent
    const students = await Promise.all(batchPromises);
    allStudents.push(...students);
  }

  return allStudents;
}
