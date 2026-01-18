import { faker } from '@faker-js/faker';
import * as Form from '@radix-ui/react-form';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useUserRepository } from '../repositories';
import { AvatarSelector } from './AvatarSelector';
import styles from './Form.module.css';
import { FormDialogFooter } from './FormDialogFooter';
import { FormServerError } from './FormServerError';
import { TextInput } from './TextInput';

const changeFormValue = (setter: Dispatch<SetStateAction<string>>) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };
};

interface AddUserFormProps {
  setOpen: (open: boolean) => void;
  loadUsers: () => void;
}

export const AddUserForm = ({ setOpen, loadUsers }: AddUserFormProps) => {
  const userRepository = useUserRepository();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = {
        id: faker.string.uuid(),
        firstName,
        lastName,
        age: age ? Number(age) : undefined,
        profileImageUrl: selectedAvatar,
      };
      await userRepository.add(user);
      await loadUsers();
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form.Root onSubmit={onSubmit}>
      <div className={styles.FormContent}>
        <AvatarSelector selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
        <TextInput
          label="First Name *"
          value={firstName}
          disabled={submitting}
          required
          onChange={changeFormValue(setFirstName)}
        />
        <TextInput
          label="Last Name *"
          value={lastName}
          disabled={submitting}
          required
          onChange={changeFormValue(setLastName)}
        />
        <TextInput label="Age" value={age} disabled={submitting} type="number" onChange={changeFormValue(setAge)} />
      </div>
      <FormServerError error={error} />
      <FormDialogFooter submitButtonLabel="Create" />
    </Form.Root>
  );
};
