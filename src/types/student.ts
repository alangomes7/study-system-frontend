export interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  register: string;
  subscriptionId?: number;
  subscriptionDate?: string;
}

export type StudentCreationData = Omit<Student, 'id'>;

export type CreateStudentOptions = {
  onSuccess?: (
    data: Student,
    variables: StudentCreationData,
    context: unknown,
  ) => void;
};
