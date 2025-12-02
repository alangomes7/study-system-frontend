import { FieldConfig } from './types';

export const ALL_FIELDS: FieldConfig[] = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    autoComplete: 'name',
  },
  {
    label: 'Phone',
    name: 'phone',
    type: 'mask',
    mask: '(00) 0 0000-0000',
    inputType: 'tel',
    autoComplete: 'tel',
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    label: 'Register (CPF)',
    name: 'register',
    type: 'mask',
    mask: '000.000.000-00',
    inputType: 'tel',
    autoComplete: 'off',
  },
];
