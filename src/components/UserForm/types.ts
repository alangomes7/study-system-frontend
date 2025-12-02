import { Student, Professor, UserType, UserApp } from '@/types';

export type UserFormState = {
  name: string;
  email: string;
  phone: string;
  register: string;
  password: string;
};

export type UserFormField = keyof UserFormState;

export interface UserFormProps {
  userType: UserType;
  title?: string;
  user?: Student | Professor | UserApp | null;
  submitLabel?: string;
  disableSubmit?: boolean;
}

export type FieldConfig = {
  label: string;
  name: UserFormField;
  type: 'text' | 'email' | 'password' | 'mask';
  mask?: string;
  inputType?: string;
  autoComplete?: string;
};
