export interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  register: string;
}

export type StudentCreationData = Omit<Student, 'id'>;
