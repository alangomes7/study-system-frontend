'use client';

import { useCreateProfessor } from '../api/useProfessors';
import { useCreateStudent } from '../api/useStudents';
import { useCreateUserApp } from '../api/useUserApps';
import { AnyUserCreationData } from './types';

/**
 * A hook that aggregates creation logic for various user types.
 * * Update hooks (e.g., useUpdateStudent) are not included here because they
 * require an ID at initialization time.
 * Those should be imported and used directly in the specific components.
 */
export const useMutations = () => {
  // Initialize the specific entity mutations
  const studentMutation = useCreateStudent();
  const professorMutation = useCreateProfessor();
  const userAppMutation = useCreateUserApp();

  return {
    // --- Student Creation ---
    createStudent: (data: AnyUserCreationData) =>
      studentMutation.mutateAsync(data as any),

    isCreatingStudent: studentMutation.isPending,
    studentError: studentMutation.error,

    // --- Professor Creation ---
    createProfessor: (data: AnyUserCreationData) =>
      professorMutation.mutateAsync(data as any),

    isCreatingProfessor: professorMutation.isPending,
    professorError: professorMutation.error,

    // --- User/Admin App Creation ---
    createUserApp: (data: AnyUserCreationData) =>
      userAppMutation.mutateAsync(data as any),

    isCreatingUserApp: userAppMutation.isPending,
    userAppError: userAppMutation.error,
  };
};
