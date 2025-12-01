import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, CheckIcon } from '@radix-ui/react-icons';
import { Button } from '../button/Button';
import styles from './AddUserDialog.module.css';
import { AddUserAvatar } from '../add-user-avatar/AddUserAvatar';
import { SelectAvatarButton } from '../select-avatar-button/SelectAvatarButton';
import { SelectAvatarMenu } from '../select-avatar-menu/SelectAvatarMenu';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddUserDialog = ({ open, onOpenChange }: AddUserDialogProps) => {
  const [openAvatarSelectMenu, setOpenAvatarSelectMenu] = React.useState(false);
  const handleOpenAvatarSelecMenu = () => setOpenAvatarSelectMenu((prev) => !prev);

  const [selectedAvatar, setSelectedAvatar] = React.useState('');
  const handleSelctedAvatar = (imagUrl: string) => setSelectedAvatar(imagUrl);

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
