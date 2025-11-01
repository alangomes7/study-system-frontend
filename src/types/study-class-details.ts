interface Professor {
  id: number;
  name: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

export interface StudyClassDetails {
  id: number;
  code: string;
  semester: number;
  year: number;
  professor: Professor;
  students: Student[];
}
