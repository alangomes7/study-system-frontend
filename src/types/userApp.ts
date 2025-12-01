export interface UserApp {
  id: number;
  name: string;
  email: string;
  password?: string;
  role?: string;
}

export type UserAppCreationData = Omit<UserApp, 'id'>;
