import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserType, Student, Professor, UserApp } from '@/types';
import {
  UserFormErrors,
  UserFormData,
  userAccountSchema,
  userEntitySchema,
} from '@/lib/schemas';
import {
  createProfessor,
  createStudent,
  createUserApp,
  updateProfessor,
  updateStudent,
  // updateUserApp, // Uncomment when available
} from '@/lib/api';
import { AnyUserCreationData } from './types';

interface UseUserFormProps {
  userType: UserType;
  user?: Student | Professor | UserApp | null;
  onSuccess?: () => void;
}

export default function useUserForm({
  userType,
  user,
  onSuccess,
}: UseUserFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<{ message: string } | null>(null);

  // Determine which schema to use based on User Type
  const isInternalUser = userType === 'ADMIN' || userType === 'User';
  const activeSchema = isInternalUser ? userAccountSchema : userEntitySchema;

  // Initialize State
  const [formData, setFormData] = useState<UserFormData>(() => {
    if (user) {
      // Edit Mode
      return {
        name: user.name || '',
        email: user.email || '',
        password: '', // Password usually reset on edit or handled separately
        phone: (user as any).phone || '',
        register: (user as any).register || '',
      } as UserFormData;
    }

    // Create Mode
    if (isInternalUser) {
      return { name: '', email: '', password: '' };
    } else {
      return { name: '', email: '', phone: '', register: '' };
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof UserFormErrors];
        return newErrors;
      });
    }
  };

  const handleMaskedChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof UserFormErrors];
        return newErrors;
      });
    }
  };

  // --- API Selection Logic ---
  const performApiCall = async (data: UserFormData) => {
    const isEditMode = !!user;
    const userId = user?.id;

    // Cast form data to the API type.
    // We assume Zod validation ensures the shape is correct for the specific userType.
    const apiData = data as unknown as AnyUserCreationData;

    switch (userType) {
      case 'Student':
        console.log(
          `Calling ${isEditMode ? 'UPDATE' : 'CREATE'} Student API`,
          apiData,
        );
        if (isEditMode && userId) {
          return await updateStudent(userId, apiData);
        }
        return await createStudent(apiData);

      case 'Professor':
        console.log(
          `Calling ${isEditMode ? 'UPDATE' : 'CREATE'} Professor API`,
          apiData,
        );
        if (isEditMode && userId) {
          return await updateProfessor(userId, apiData);
        }
        return await createProfessor(apiData);

      case 'ADMIN':
      case 'User':
        console.log(
          `Calling ${isEditMode ? 'UPDATE' : 'CREATE'} UserApp API`,
          apiData,
        );

        if (isEditMode) {
          // Logic for updating Admin/UserApp if needed
          // return await updateUserApp(userId, apiData);
          console.warn('Update logic for ADMIN/User is not yet implemented.');
          return;
        }

        return await createUserApp(apiData);

      default:
        throw new Error('Invalid User Type');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);
    setErrors({});

    // 3. Dynamic Validation
    const result = activeSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const validData = result.data;

      // 4. Submit Logic with Endpoint Selection
      await performApiCall(validData);

      // On success:
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      setApiError({ message: error.message || 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleMaskedChange,
    handleSubmit,
  };
}
