import { z } from 'zod';
import { userAccountSchema } from './userAccountSchema';
import { userEntitySchema } from './userEntitySchema';

// Types
export type UserEntityData = z.infer<typeof userEntitySchema>;
export type UserAccountData = z.infer<typeof userAccountSchema>;

// Union type for use in the Form Component to handle both cases
export type UserFormData = UserEntityData | UserAccountData;

export type UserFormErrors = z.ZodFlattenedError<UserFormData>['fieldErrors'];

// Others exports
export * from './userAccountSchema';
export * from './userEntitySchema';
