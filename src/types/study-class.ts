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
  'id' | 'courseName' | 'professorName'
>;
