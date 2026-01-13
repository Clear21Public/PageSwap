import * as RadixDialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import styles from './AddUserButton.module.css';
import { AddUserForm } from './AddUserForm';
import { Dialog } from './Dialog';

export const AddUserButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <RadixDialog.Root open={open} onOpenChange={setOpen}>
      <RadixDialog.Trigger asChild>
        <button className={`${styles.Button} green`}>
          <i className="fa-solid fa-plus" />
          Add User
        </button>
      </RadixDialog.Trigger>
      <Dialog title="Add User to System">
        <AddUserForm setOpen={setOpen} />
      </Dialog>
    </RadixDialog.Root>
  );
};
