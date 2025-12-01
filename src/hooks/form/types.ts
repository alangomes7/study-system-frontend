import {
  ProfessorCreationData,
  StudentCreationData,
  UserAppCreationData,
} from '@/types';

export type AnyUserCreationData =
  | StudentCreationData
  | ProfessorCreationData
  | UserAppCreationData;

export type UserMutationVariables = {
  id?: string | number;
  data: AnyUserCreationData;
};
