import * as RadixDialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { AddUserForm } from './AddUserForm';
import { Dialog } from './Dialog';
import { Button } from './Button';

interface AddUserButtonProps {
  loadUsers: () => void;
}

export const AddUserButton = ({ loadUsers }: AddUserButtonProps) => {
  const [open, setOpen] = useState(false);
  return (
    <RadixDialog.Root open={open} onOpenChange={setOpen}>
      <RadixDialog.Trigger asChild>
        <Button className="green" icon="fa-plus" label="Add User" />
      </RadixDialog.Trigger>
      <Dialog title="Add User to System">
        <AddUserForm setOpen={setOpen} loadUsers={loadUsers} />
      </Dialog>
    </RadixDialog.Root>
  );
};
