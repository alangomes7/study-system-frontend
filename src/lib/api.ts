/**
 * This file contains all the core data-fetching functions.
 */
import { Course, CourseCreationData } from '@/types/course';
import { Professor, ProfessorCreationData } from '@/types/professor';
import { Student, StudentCreationData } from '@/types/student';
import { StudyClass, StudyClassCreationData } from '@/types/study-class';
import { Subscription, SubscriptionCreationData } from '@/types/subscription';

const API_BASE_URL = 'http://172.23.9.129:8080';

/* -------------------------------------------------------------------------- */
/* COURSES                                  */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* STUDY CLASSES                               */
/* -------------------------------------------------------------------------- */

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
  if (!response.ok) {
    throw new Error('Failed to fetch study class details');
  }
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

/* -------------------------------------------------------------------------- */
/* PROFESSORS                                 */
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

/* -------------------------------------------------------------------------- */
/* STUDENTS                                  */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* SUBSCRIPTIONS                               */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all subscriptions for a specific study class.
 * @param studyClassId The ID of the study class.
 * @returns A promise that resolves to an array of Subscription objects.
 */
export async function getSubscriptionsByStudyClass(
  studyClassId: number,
): Promise<Subscription[]> {
  const response = await fetch(
    `${API_BASE_URL}/subscriptions?studyClassId=${studyClassId}`,
  );

  if (!response.ok) throw new Error('Failed to fetch subscriptions');
  return response.json();
}

/**
 * Enrolls a student in a study class by creating a new subscription.
 * @param subscriptionData An object containing the studentId and studyClassId.
 * @returns A promise that resolves to the newly created Subscription object.
 */
export async function createSubscription(
  subscriptionData: SubscriptionCreationData,
): Promise<Subscription> {
  const response = await fetch(`${API_BASE_URL}/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscriptionData),
  });

  if (!response.ok) throw new Error('Failed to enroll student');
  return response.json();
}
