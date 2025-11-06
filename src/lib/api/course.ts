import { Course, CourseCreationData } from '@/types';
import { API_BASE_URL } from './client';

/**
 * Fetches a list of all courses.
 * @returns A promise that resolves to an array of Course objects.
 */
export async function getCourses(): Promise<Course[]> {
  // We remove 'cache: no-store' as React Query will handle caching.
  const response = await fetch(`${API_BASE_URL}/courses`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
}

/**
 * Fetches details for a single course by its ID.
 * @param id The ID of the course to fetch.
 * @returns A promise that resolves to the Course object.
 * @throws Throws an error if the course is not found (404) or on API failure.
 */
export async function getCourse(id: string): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`);

  if (!response.ok) {
    if (response.status === 404) throw new Error('Course not found');
    throw new Error('Failed to fetch course details');
  }

  return response.json();
}

/**
 * Creates a new course.
 * @param courseData An object containing the new course's details.
 * @returns A promise that resolves to the newly created Course object.
 */
export async function createCourse(
  courseData: CourseCreationData,
): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    throw new Error('Failed to create course');
  }
  return response.json();
}
