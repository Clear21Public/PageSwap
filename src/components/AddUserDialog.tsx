import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { faker } from '@faker-js/faker';
import { useUserRepository } from '../repositories';
import styles from './AddUserDialog.module.css';
import { useCallback, useState } from 'react';
import { SelectUserAvatar } from './SelectUserAvatar.tsx';
import type { IUser } from '../types/IUser.ts';

interface ServerPropertyError {
  property: string;
  message: string;
}

export function AddUserDialog({ successfulAddCallback }: { successfulAddCallback?: () => void }) {
  const [open, setOpen] = useState(false);

  // our server errors is just a simple string for now
  const [serverErrors, setServerErrors] = useState<string>('');
  const [serverPropertyErrors, setServerPropertyErrors] = useState<ServerPropertyError[]>([]);

  const [avatarId, setAvatarId] = useState('');

  const userRepo = useUserRepository();

  const formSubmitHandler = useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      const userData = Object.fromEntries(new FormData(event.currentTarget)) as Partial<IUser>;

      // console.log(userData);
      userRepo
        .add({
          id: userData.id ?? faker.string.uuid(),
          firstName: userData.firstName as string,
          lastName: userData.lastName as string,
          profileImageUrl: userData.profileImageUrl ?? '',
          age: userData.age ? Number(userData.age) : undefined,
        })
        .then(() => {
          setServerErrors('');
          setOpen(false);
          if (successfulAddCallback !== undefined) {
            successfulAddCallback();
          }
        })
        .catch((error) => {
          console.error('Error adding user:', error.propertyErrors);
          setServerPropertyErrors(error.propertyErrors);
          setServerErrors(error.message);
        });
      event.preventDefault();
    },
    [successfulAddCallback, userRepo]
  );
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className={`${styles.dialogButton} ${styles.green}`}>+ Add User</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={`${styles.dialogOverlay}`} />
        <Dialog.Content className={`${styles.dialogContent}`}>
          <Dialog.Title className={`${styles.dialogTitle}`}>Add User to System</Dialog.Title>
          <Dialog.Description>
            <VisuallyHidden>Enter the following information to add a new user to the system.</VisuallyHidden>
          </Dialog.Description>
          <Form.Root onSubmit={formSubmitHandler}>
            <div className={`${styles.formContent}`}>
              <Form.Field className={`${styles.fieldset}`} name="profileImageUrl">
                <SelectUserAvatar setAvatarId={setAvatarId} />
                <Form.Control asChild>
                  <input type="hidden" value={avatarId} />
                </Form.Control>
              </Form.Field>
              <Form.Field className={`${styles.fieldset}`} name="firstName">
                <Form.Label className={`${styles.label}`}>
                  First Name <span className={`${styles.requiredAsterisk}`}>*</span>
                </Form.Label>
                <Form.Control asChild>
                  <input className={`${styles.input}`} defaultValue="Pedro" required />
                </Form.Control>
                <Form.Message className={`${styles.formMessage} ${styles.error}`} match="valueMissing">
                  Please enter your first name
                </Form.Message>
              </Form.Field>
              <Form.Field className={`${styles.fieldset}`} name="lastName">
                <Form.Label className={`${styles.label}`}>
                  Last Name <span className={`${styles.requiredAsterisk}`}>*</span>
                </Form.Label>
                <Form.Control asChild>
                  <input className={`${styles.input}`} defaultValue="Duarte" required />
                </Form.Control>
                <Form.Message className={`${styles.formMessage} ${styles.error}`} match="valueMissing">
                  Please enter your last name
                </Form.Message>
              </Form.Field>
              <Form.Field className={`${styles.fieldset}`} name="age">
                <Form.Label className={`${styles.label}`}>Age</Form.Label>
                <Form.Control asChild>
                  <input className={`${styles.input}`} type="number" defaultValue="32" />
                </Form.Control>
                <Form.Message
                  className={`${styles.formMessage} ${styles.error}`}
                  match={(value: number) => value < 5 || value > 120}
                >
                  Age must be between 5 and 120.
                </Form.Message>
              </Form.Field>
              {serverErrors && (
                <div className={`${styles.formMessage} ${styles.error}`}>
                  {serverErrors}
                  {serverPropertyErrors.length && (
                    <ul>
                      {serverPropertyErrors.map(({ property, message }) => (
                        <li key={property}>{message}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className={`${styles.dialogButtonWrapper}`}>
              <Dialog.Close asChild>
                <button className={`${styles.dialogButton}`}>Cancel</button>
              </Dialog.Close>
              <Form.Submit className={`${styles.dialogButton} ${styles.green} ${styles.createButton}`}>
                <i className="fa-solid fa-check" />
                Create
              </Form.Submit>
            </div>
          </Form.Root>
          <Dialog.Close asChild>
            <button className={`${styles.iconButton}`} aria-label="Close">
              <i className="fa-solid fa-remove" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
