import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form';
import styles from './UserDialog.module.css';
import formStyles from './Form.module.css';

function UserForm() {
  return (
    <Form.Root className={formStyles.Root}>
      <Form.Field className={formStyles.Field} name="email">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <img src="./assets/placeholder-dp.png" alt="default user image" />
          <Form.Label className={formStyles.Label}>First Name</Form.Label>
          <Form.Message className={formStyles.Message} match="valueMissing">
            Please enter a value
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input className={formStyles.Input} type="email" required />
        </Form.Control>
      </Form.Field>
      <Form.Field className={formStyles.Field} name="question">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Form.Label className={formStyles.Label}>Question</Form.Label>
          <Form.Message className={formStyles.Message} match="valueMissing">
            Please enter a question
          </Form.Message>
        </div>
        <Form.Control asChild>
          <textarea className={formStyles.Textarea} required />
        </Form.Control>
      </Form.Field>
      <Form.Submit asChild>
        <button className={formStyles.Button} style={{ marginTop: 10 }}>
          Post question
        </button>
      </Form.Submit>
    </Form.Root>
  )
}

interface UserDialogProps {
  buttonText: string;
}

export function UserDialog( { buttonText }: UserDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button onClick={() => setOpen(!open)}>{buttonText}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.Overlay} />
        <Dialog.Content className={styles.Content}>
          <Dialog.Title className={styles.Title}>Add User to System</Dialog.Title>
          <UserForm />
          <div
            style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}
          >
            <Dialog.Close asChild>
              <button className={`${styles.Button} green`}>Save changes</button>
            </Dialog.Close>
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
