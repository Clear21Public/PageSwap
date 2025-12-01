import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, CheckIcon } from '@radix-ui/react-icons';
import { Button } from '../button/Button';
import styles from './AddUserDialog.module.css';
import { AddUserAvatar } from "../add-user-avatar/AddUserAvatar"

type AddUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddUserDialog = ({ open, onOpenChange }: AddUserDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
            <AddUserAvatar imageId="1d4040ea-9a2c-468d-83b4-de9a8f62ed86.jpg"/>
          </div>
          <div className={styles.Footer}>
            <Dialog.Close asChild>
              <Button className={styles.Button}>
                <CheckIcon /> Create
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
