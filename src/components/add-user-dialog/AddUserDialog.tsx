import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, CheckIcon } from '@radix-ui/react-icons';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { clsx } from 'clsx';

import { Button } from '../button/Button';
import styles from './AddUserDialog.module.css';
import { AddUserAvatar } from '../add-user-avatar/AddUserAvatar';
import { SelectAvatarButton } from '../select-avatar-button/SelectAvatarButton';
import { SelectAvatarMenu } from '../select-avatar-menu/SelectAvatarMenu';

import { useUserRepository } from '../../repositories';
import { type IValidationError, type IPropertyError } from '../../types/IValidationError';

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
  const userRepository = useUserRepository();

  // track the open state of the avatar select menu
  const [openAvatarSelectMenu, setOpenAvatarSelectMenu] = React.useState(false);
  // handle the change of open state of avatar select menu
  const handleOpenAvatarSelectMenuChange = () => setOpenAvatarSelectMenu((prev) => !prev);

  // track selected avatar state
  const [selectedAvatar, setSelectedAvatar] = React.useState('');
  // handle the change of selected avatar
  const handleSelctedAvatarChange = (imagUrl: string) => setSelectedAvatar(imagUrl);

  // track form submission errors
  const [submitError, setSubmitError] = React.useState<IPropertyError[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    shouldFocusError: false,
  });

  // handle form submission
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    console.log({ data });
    try {
      // reset any submit errors at the start of a submission
      setSubmitError([]);

      const id = uuidv4();
      const userID = await userRepository.add({
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age ? Number(data.age) : undefined,
        profileImageUrl: data.profileImageUrl,
      });

      const newUser = await userRepository.get(userID);
      console.log({ newUser });

      // close dialog on success
      onOpenChange(false);
    } catch (error) {
      // set submit error on error
      setSubmitError((error as IValidationError).propertyErrors);
    }
  };

  // set the profile image in the form data once selected by user
  // runs when selectedAvatar changes
  React.useEffect(() => {
    setValue('profileImageUrl', selectedAvatar);
  }, [selectedAvatar, setValue]);

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
                <AddUserAvatar avatarId={selectedAvatar} />
                {<SelectAvatarButton open={openAvatarSelectMenu} onClick={handleOpenAvatarSelectMenuChange} />}
              </div>
              {openAvatarSelectMenu && <SelectAvatarMenu handleSelectAvatar={handleSelctedAvatarChange} />}
            </div>
            <form id="add-user-form" className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.FormSection}>
                <label className={styles.FormLabel}>
                  First Name <span className={styles.RequiredField}>*</span>
                </label>
                <input
                  className={
                    errors.firstName
                      ? clsx(styles.FormInput, styles.FormInputError)
                      : isSubmitting
                        ? clsx(styles.FormInputDisabled, styles.FormInput)
                        : styles.FormInput
                  }
                  {...register('firstName', {
                    required: { value: true, message: 'Please enter a value' },
                  })}
                  disabled={isSubmitting}
                />
                {errors.firstName && <label className={styles.ErrorLabel}>{errors.firstName.message}</label>}
              </div>
              <div className={styles.FormSection}>
                <label className={styles.FormLabel}>
                  Last Name <span className={styles.RequiredField}>*</span>
                </label>
                <input
                  className={
                    errors.lastName
                      ? clsx(styles.FormInput, styles.FormInputError)
                      : isSubmitting
                        ? clsx(styles.FormInputDisabled, styles.FormInput)
                        : styles.FormInput
                  }
                  {...register('lastName', { required: { value: true, message: 'Please enter a value' } })}
                  disabled={isSubmitting}
                />
                {errors.lastName && <label className={styles.ErrorLabel}>{errors.lastName.message}</label>}
              </div>
              <div className={styles.FormSection}>
                <label className={styles.FormLabel}>Age</label>
                <input
                  className={isSubmitting ? clsx(styles.FormInputDisabled, styles.FormInput) : styles.FormInput}
                  {...register('age')}
                  type="number"
                  disabled={isSubmitting}
                />
              </div>
            </form>
            {submitError.length > 0 && (
              <div className={styles.FormSubmitError}>
                {submitError.map((error, i) => (
                  <label key={i} className={styles.FormSubmitErrorLabel}>
                    {error.message}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className={styles.Footer}>
            <Dialog.Close asChild>
              <Button className={styles.CancelButton}>Cancel</Button>
            </Dialog.Close>
            <div style={{ flexGrow: 1 }} />
            <Button
              className={isSubmitting ? clsx(styles.SubmitButtonDisabled, styles.SubmitButton) : styles.SubmitButton}
              form="add-user-form"
              type="submit"
              disabled={isSubmitting}
            >
              <CheckIcon /> Create
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
