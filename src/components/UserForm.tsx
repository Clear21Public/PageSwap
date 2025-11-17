import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from '@radix-ui/react-icons';
import { Input } from '../primitives';
import { AvatarPicker } from './AvatarPicker';
import base from '../styles/base.module.css';
import styles from './UserForm.module.css';

const userSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  age: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || val > 0, {
      message: 'Age must be a positive number'
    }),
  avatar: z.object({ id: z.string(), url: z.string() }).optional()
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  isCreatingUser?: boolean;
  onCancel?: () => void;
  onSubmit: (data: UserFormData) => void;
}

const UserForm = ({ isCreatingUser, onCancel, onSubmit }: UserFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userSchema),
    mode: 'onBlur'
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.fields}>
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => <AvatarPicker {...field} />}
        />
        <Input
          required
          id="firstName"
          label="First Name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          required
          id="lastName"
          label="Last Name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        <Input
          id="age"
          label="Age"
          type="number"
          error={errors.age?.message}
          {...register('age')}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={base.btn}
          type="button"
          disabled={isCreatingUser}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button className={base.btnSuccess} type="submit" disabled={isCreatingUser}>
          <CheckIcon />
          Create
        </button>
      </div>
    </form>
  );
};

export { UserForm, type UserFormProps, type UserFormData };
