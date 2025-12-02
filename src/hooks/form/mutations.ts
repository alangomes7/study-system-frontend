import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createStudent,
  createProfessor,
  createUserApp,
  updateStudent,
  updateProfessor,
} from './userService';
import { AnyUserCreationData } from './types';

// Generic type for the options object passed to create hooks
type MutationOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

// --- Student Hooks ---

export const useCreateStudent = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnyUserCreationData) => createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      options?.onSuccess?.();
    },
    onError: error => {
      console.error('Failed to create student:', error);
      options?.onError?.(error);
    },
  });
};

export const useUpdateStudent = (id: number | string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // The mutation function closes over the 'id' passed to the hook
    mutationFn: (data: AnyUserCreationData) => updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', id] });
    },
    onError: error => {
      console.error(`Failed to update student ${id}:`, error);
    },
  });
};

// --- Professor Hooks ---

export const useCreateProfessor = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnyUserCreationData) => createProfessor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] });
      options?.onSuccess?.();
    },
    onError: error => {
      console.error('Failed to create professor:', error);
      options?.onError?.(error);
    },
  });
};

export const useUpdateProfessor = (id: number | string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnyUserCreationData) => updateProfessor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] });
      queryClient.invalidateQueries({ queryKey: ['professor', id] });
    },
    onError: error => {
      console.error(`Failed to update professor ${id}:`, error);
    },
  });
};

// --- User/Admin App Hooks ---

export const useCreateUserApp = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnyUserCreationData) => createUserApp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options?.onSuccess?.();
    },
    onError: error => {
      console.error('Failed to create user:', error);
      options?.onError?.(error);
    },
  });
};
