import { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import * as Separator from '@radix-ui/react-separator';
import { FormDialogFooter } from './FormDialogFooter.tsx';
import { FormServerError } from './FormServerError';
import styles from './AddUserButton.module.css';
import { useUserRepository } from '../repositories/RepositoryContext.tsx';
import type { IUser } from '../types/IUser.ts';
import { getFullName } from '../helpers/userHelper.ts';

interface RemoveUserFormProps {
  setOpen: (open: boolean) => void;
  user: IUser;
}

export const RemoveUserForm = ({ setOpen, user }: RemoveUserFormProps) => {
  const userRepository = useUserRepository();
  const [error, setError] = useState();
  const fullName = getFullName(user.firstName, user.lastName);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userRepository.delete(user.id);
      setOpen(false);
    } catch (e: any) {
      console.error(e);
      setError(e);
    }
  };

  return (
    <Form.Root onSubmit={onSubmit}>
      <div className={styles.FormContent}>Are you sure you want to remove {fullName}?</div>
      <FormServerError error={error} />
      <Separator.Root className={styles.Separator} />
      <FormDialogFooter submitButtonLabel="Yes" />
    </Form.Root>
  );
};
