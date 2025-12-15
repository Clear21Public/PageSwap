import { useFormContext } from 'react-hook-form';
import type { IAddUserForm } from '../../types/IUser';
import { Input } from './Input';
import { AvatarSelector } from './AvatarSelector/AvatarSelector';
export const ADD_USER_FORM_ID = 'ADD_USER_FORM_ID';

export const AddUserForm = () => {
  const { handleSubmit, register } = useFormContext<IAddUserForm>();

  const onSubmit = (data: IAddUserForm) => {
    console.log('__submit', data);
  };

  return (
    <form id={ADD_USER_FORM_ID} onSubmit={handleSubmit(onSubmit)}>
      <AvatarSelector />
      <Input required labelProps={{ label: 'First Name' }} {...register('firstName')} />
      <Input required labelProps={{ label: 'Last Name' }} {...register('firstName')} />
    </form>
  );
};
