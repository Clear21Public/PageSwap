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

import { useImageRepository, useUserRepository, AVATAR_IDS } from '../../repositories';
import { type IValidationError, type IPropertyError } from '../../types/IValidationError';
import type { IUser } from '../../types/IUser';
import { AvatarImage } from '@radix-ui/react-avatar';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateUsers: (user?: IUser) => void;
}

type FormInput = {
  firstName: string;
  lastName: string;
  age: number | null;
  profileImageUrl: string;
};

const defaultValues: FormInput = {
  firstName: '',
  lastName: '',
  age: null,
  profileImageUrl: '',
};

export type AvatarImage = {
  id: string;
  url: string;
};

export const AddUserDialog = ({ open, onOpenChange, updateUsers }: AddUserDialogProps) => {
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

  // load the images when dialog is mounted, passed into SelectAvatarMenu as props
  const imageRepository = useImageRepository();
  const [avatarImages, setAvatarImages] = React.useState<AvatarImage[]>([]);

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    shouldFocusError: false,
    defaultValues,
  });

  // handle form submission
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      // reset any submit errors at the start of a submission
      setSubmitError([]);

      // add user to userRepository
      const id = uuidv4();
      const user: IUser = {
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age ? Number(data.age) : undefined,
        profileImageUrl: data.profileImageUrl,
      };
      await userRepository.add(user);

      // update users in parent component UsersPage to update table on success
      updateUsers(user);

      // reset form fields
      reset(defaultValues, { keepDefaultValues: true });

      // close avatar menu select
      setOpenAvatarSelectMenu(false);

      // reset selected avatar
      setSelectedAvatar('');

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

  // set the avatar images once loaded and passed as props to SelectAvatarMenu
  React.useEffect(() => {
    Promise.all(AVATAR_IDS.map((id) => imageRepository.get(`${id}.jpg`))).then((urls) => {
      setAvatarImages(urls.map((url, i) => ({ id: `${AVATAR_IDS[i]}.jpg`, url }) as AvatarImage));
    });
  }, [imageRepository]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Description>Add User to System</Dialog.Description>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.Overlay} />
        <Dialog.Content className={styles.Content}>
          {/* Dialog title */}
          <Dialog.Title className={styles.Title}>
            <p className={styles.TitleHeading}>Add User to System</p>
            <Dialog.Close asChild>
              <button className={styles.IconButton} aria-label="Close">
                <Cross2Icon className={styles.Icon} />
              </button>
            </Dialog.Close>
          </Dialog.Title>

          {/* Dialog body */}
          <div className={styles.Body}>
            {/* Avatar section */}
            <div className={styles.AvatarSection}>
              <div className={styles.SelectAvatar}>
                <AddUserAvatar avatarImageUrl={selectedAvatar} />
                {<SelectAvatarButton open={openAvatarSelectMenu} onClick={handleOpenAvatarSelectMenuChange} />}
              </div>
              {openAvatarSelectMenu && (
                <SelectAvatarMenu handleSelectAvatar={handleSelctedAvatarChange} avatarImages={avatarImages} />
              )}
            </div>

            {/* Form */}
            <form id="add-user-form" className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
              {/* First name */}
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

              {/* Last name */}
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

              {/* Age */}
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

            {/* Submit errors */}
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

          {/* Dialog footer */}
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
