import * as RadixDialog from '@radix-ui/react-dialog';
import * as Separator from '@radix-ui/react-separator';
import styles from './Dialog.module.css';

interface DialogProps extends React.PropsWithChildren {
  title: string;
}

export const Dialog = ({ title, children }: DialogProps) => {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={styles.Overlay} />
      <RadixDialog.Content className={styles.Content} aria-describedby={title}>
        <RadixDialog.Title className={styles.Title}>{title}</RadixDialog.Title>
        <Separator.Root className={styles.Separator} />
        {children}
        <DialogCloseButton />
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
};

export const DialogCloseButton = () => {
  return (
    <RadixDialog.Close asChild>
      <button className={styles.IconButton} aria-label="Close">
        <i className="fa-solid fa-x" />
      </button>
    </RadixDialog.Close>
  );
};
