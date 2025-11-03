export interface Professor {
  id: number;
  name: string;
  phone: string;
  email: string;
  register: string;
}

export type ProfessorCreationData = Omit<Professor, 'id'>;
