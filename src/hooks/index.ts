/**
 * Central export hub for all application hooks.
 *
 * This file re-exports custom React hooks from across the application,
 * serving as a single entry point. This simplifies module imports,
 * improves hook discoverability, and promotes a clean project structure.
 *
 * ---
 *
 * ### API Hooks
 *
 * Re-exports **all named exports** from the following modules:
 * - `api/useCourses`
 * - `api/useStudyClasses`
 * - `api/useProfessors`
 * - `api/useStudents`
 * - `api/useSubscriptions`
 *
 * ### Form Hooks
 *
 * Re-exports the **default export** from each module as a named export:
 * - `form/useCourseForm` (as `useCourseForm`)
 * - `form/useStudentGroup` (as `useStudentGroup`)
 * - `form/useStudyClassForm` (as `useStudyClassForm`)
 * - `form/useUserForm` (as `useUserForm`)
 *
 * @example
 * // Import any hook directly from this single module
 * import { useGetCourses, useUserForm } from '@/hooks';
 *
 * @module @/hooks
 */

// API Hooks
export * from './api/useCourses';
export * from './api/useStudyClasses';
export * from './api/useProfessors';
export * from './api/useStudents';
export * from './api/useSubscriptions';
export * from './api/useUserApps';
export * from './api/useAuth';

// Form Hooks
export { default as useCourseForm } from './form/useCourseForm';
export { default as useStudentGroup } from './form/useStudentGroup';
export { default as useStudyClassForm } from './form/useStudyClassForm';
export { default as useUserForm } from './form/useUserForm';
export { default as useLoginForm } from './form/useLoginForm';
