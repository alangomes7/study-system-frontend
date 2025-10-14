interface Professor {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

export interface StudyClassDetails {
  id: string;
  code: string;
  semester: number;
  year: number;
  professor: Professor;
  students: Student[];
}
