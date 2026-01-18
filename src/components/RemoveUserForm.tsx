import * as Form from '@radix-ui/react-form';
import { useState } from 'react';
import { getFullName } from '../helpers/userHelper.ts';
import { useUserRepository } from '../repositories/RepositoryContext.tsx';
import type { IUser } from '../types/IUser.ts';
import formStyles from './Form.module.css';
import { FormDialogFooter } from './FormDialogFooter.tsx';
import { FormServerError } from './FormServerError';

interface RemoveUserFormProps {
  setOpen: (open: boolean) => void;
  user: IUser;
}

export const RemoveUserForm = ({ setOpen, user }: RemoveUserFormProps) => {
  const userRepository = useUserRepository();
  const [error, setError] = useState<unknown>();
  const fullName = getFullName(user.firstName, user.lastName);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userRepository.delete(user.id);
      setOpen(false);
    } catch (e: unknown) {
      console.error(e);
      setError(e);
    }
  };

  return (
    <Form.Root onSubmit={onSubmit}>
      <div className={formStyles.FormContent}>Are you sure you want to remove {fullName}?</div>
      <FormServerError error={error} />
      <FormDialogFooter submitButtonLabel="Yes" />
    </Form.Root>
  );
};
