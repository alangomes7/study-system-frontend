export interface Subscription {
  id: number;
  date: string;
  studentId: number;
  studentName: string;
  studyClassId: number;
  classCode: string;
}

export type SubscriptionCreationData = {
  studentId: number;
  studyClassId: number;
};
