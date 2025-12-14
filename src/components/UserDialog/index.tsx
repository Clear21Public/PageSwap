import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog'
import styles from './index.module.css';
import { UserForm } from './Form';

interface UserDialogProps {
  buttonText: string;
}

const FORM_ID = "userForm"

export function UserDialog( { buttonText }: UserDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button onClick={() => setOpen(!open)}>{buttonText}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.Overlay} />
        <Dialog.Content className={styles.Content} aria-describedby={undefined}>
          <Dialog.Title className={styles.Title}>Add User to System</Dialog.Title>
          <div className={styles.Form}>
            <UserForm formId={FORM_ID} />
          </div>
          <div className={styles.Footer}>
              <button className={`${styles.Button}`} form={FORM_ID}>
                Cancel
              </button>

              <button className={`${styles.MainButton}`} form={FORM_ID}>
                <i className="fa-solid fa-check" />
                Create
              </button>
          </div>
          <Dialog.Close asChild>
            <button className={styles.IconButton} aria-label="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
