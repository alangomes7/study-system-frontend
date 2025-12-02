'use client';

import {
  useCreateProfessor,
  useCreateStudent,
  useCreateUserApp,
} from './mutations';
import { AnyUserCreationData } from './types';

/**
 * A hook that aggregates user creation logic by calling the specific entity hooks.
 * * Note: Update operations (e.g., updateStudent) are not included here because
 * the provided hooks (useUpdateStudent, useUpdateProfessor) require an `id`
 * at initialization.
 * Updates should be performed by calling those hooks directly in the specific
 * components where the entity ID is known.
 */
export const useUserService = () => {
  // Initialize the specific entity mutations
  const studentMutation = useCreateStudent();
  const professorMutation = useCreateProfessor();
  const userAppMutation = useCreateUserApp();

  return {
    // --- Student API ---
    createStudent: (data: AnyUserCreationData) =>
      studentMutation.mutateAsync(data as any),
    isCreatingStudent: studentMutation.isPending,
    studentError: studentMutation.error,

    // --- Professor API ---
    createProfessor: (data: AnyUserCreationData) =>
      professorMutation.mutateAsync(data as any),

    isCreatingProfessor: professorMutation.isPending,
    professorError: professorMutation.error,

    // --- User App (Admin/User) API ---
    createUserApp: (data: AnyUserCreationData) =>
      userAppMutation.mutateAsync(data as any),

    isCreatingUserApp: userAppMutation.isPending,
    userAppError: userAppMutation.error,
  };
};
