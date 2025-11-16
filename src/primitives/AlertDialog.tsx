import { type ReactNode } from 'react';
import { AlertDialog } from 'radix-ui';
import { CheckIcon } from '@radix-ui/react-icons';
import styles from './AlertDialog.module.css';

interface AlertDialogProps {
  title: string;
  children: ReactNode;
  isPending?: boolean;
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const Component = ({
  open,
  onClose,
  onConfirm,
  isPending,
  title,
  children
}: AlertDialogProps) => (
  <AlertDialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className={styles.overlay} />
      <AlertDialog.Content className={styles.content}>
        <AlertDialog.Title className={styles.title}>{title}</AlertDialog.Title>
        <AlertDialog.Description className={styles.description}>
          {children}
        </AlertDialog.Description>
        <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
          <AlertDialog.Cancel asChild>
            <button disabled={isPending}>Cancel</button>
          </AlertDialog.Cancel>
          <button disabled={isPending} onClick={() => onConfirm?.()}>
            <CheckIcon /> Yes
          </button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export { Component as AlertDialog, type AlertDialogProps };
