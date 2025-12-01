import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, CheckIcon } from '@radix-ui/react-icons';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from '../button/Button';
import styles from './AddUserDialog.module.css';
import { AddUserAvatar } from '../add-user-avatar/AddUserAvatar';
import { SelectAvatarButton } from '../select-avatar-button/SelectAvatarButton';
import { SelectAvatarMenu } from '../select-avatar-menu/SelectAvatarMenu';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormInput = {
  firstName: string;
  lastName: string;
  age?: number;
  profileImageUrl: string;
};

export const AddUserDialog = ({ open, onOpenChange }: AddUserDialogProps) => {
  const [openAvatarSelectMenu, setOpenAvatarSelectMenu] = React.useState(false);
  const handleOpenAvatarSelecMenu = () => setOpenAvatarSelectMenu((prev) => !prev);

  const [selectedAvatar, setSelectedAvatar] = React.useState('');
  const handleSelctedAvatar = (imagUrl: string) => setSelectedAvatar(imagUrl);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormInput>({
    shouldFocusError: false,
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => console.log(data);

  console.log({ errors, isValid });

  React.useEffect(() => {
    setValue('profileImageUrl', selectedAvatar);
  }, [selectedAvatar, setValue]);

  // TODO: fix all colours, spacing to design tokens

  // TODO: wire up user repository

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Description>Add User to System</Dialog.Description>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.Overlay} />
        <Dialog.Content className={styles.Content}>
          <Dialog.Title className={styles.Title}>
            <p className={styles.TitleHeading}>Add User to System</p>
            <Dialog.Close asChild>
              <button className={styles.IconButton} aria-label="Close">
                <Cross2Icon className={styles.Icon} />
              </button>
            </Dialog.Close>
          </Dialog.Title>
          <div className={styles.Body}>
            <div className={styles.AvatarSection}>
              <div className={styles.SelectAvatar}>
                <AddUserAvatar imageUrl={selectedAvatar} />
                {<SelectAvatarButton open={openAvatarSelectMenu} onClick={handleOpenAvatarSelecMenu} />}
              </div>
              {openAvatarSelectMenu && <SelectAvatarMenu handleSelectAvatar={handleSelctedAvatar} />}
            </div>
            <form id="add-user-form" className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.FormSection}>
                <label className={styles.FormLabel}>
                  First Name <span className={styles.RequiredField}>*</span>
                </label>
                <input
                  className={
                    errors.firstName
                      ? [styles.FormInput, styles.FormFieldError].join(' ')
                      : styles.FormInput
                  }
                  {...register('firstName', {
                    required: { value: true, message: 'Please enter a value' },
                  })}
                />
                {errors.firstName && (
                  <label className={styles.ErrorLabel}>{errors.firstName.message}</label>
                )}
              </div>
              <div className={styles.FormSection}>
                <label className={styles.FormLabel}>
                  Last Name <span className={styles.RequiredField}>*</span>
                </label>
                <input
                  className={
                    errors.lastName
                      ? [styles.FormInput, styles.FormFieldError].join(' ')
                      : styles.FormInput
                  }
                  {...register('lastName', { required: { value: true, message: 'Please enter a value' } })}
                />
                {errors.lastName && (
                  <label className={styles.ErrorLabel}>{errors.lastName.message}</label>
                )}
              </div>
              <div className={styles.FormSection}>
                <label className={styles.FormLabel}>Age</label>
                <input className={styles.FormInput} {...register('age')} />
              </div>
            </form>
          </div>
          <div className={styles.Footer}>
            <Dialog.Close asChild>
              <Button className={styles.CancelButton}>Cancel</Button>
            </Dialog.Close>
            <div style={{ flexGrow: 1 }} />
            <Button className={styles.SubmitButton} form="add-user-form" type="submit">
              <CheckIcon /> Create
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
