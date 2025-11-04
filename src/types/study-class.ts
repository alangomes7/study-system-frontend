export interface StudyClass {
  id: number;
  classCode: string;
  year: number;
  semester: number;
  courseId: number;
  courseName: string;
  professorId: number | null;
  professorName: string | null;
}

export type StudyClassCreationData = Omit<
  StudyClass,
  'id' | 'classCode' | 'courseName' | 'professorName'
>;

export type CreateStudyClassOptions = {
  onSuccess?: (
    data: StudyClass,
    variables: StudyClassCreationData,
    context: unknown,
  ) => void;
  onError?: (
    error: Error,
    variables: StudyClassCreationData,
    context: unknown,
  ) => void;
};
