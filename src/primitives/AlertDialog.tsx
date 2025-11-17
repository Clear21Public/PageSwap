import { type ReactNode } from 'react';
import { AlertDialog } from 'radix-ui';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import base from '../styles/base.module.css';
import styles from './Dialog.module.css';

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
        <div className={styles.titleWrap}>
          <AlertDialog.Title className={styles.title}>{title}</AlertDialog.Title>
          <AlertDialog.Cancel asChild>
            <button className={styles.close} aria-label="Close" type="button">
              <Cross2Icon />
            </button>
          </AlertDialog.Cancel>
        </div>
        <AlertDialog.Description className={styles.description}>
          {children}
        </AlertDialog.Description>
        <div className={styles.actions}>
          <AlertDialog.Cancel asChild>
            <button className={base.btn} disabled={isPending} type="button">
              Cancel
            </button>
          </AlertDialog.Cancel>
          <button
            className={base.btnSuccess}
            disabled={isPending}
            type="button"
            onClick={() => onConfirm?.()}
          >
            <CheckIcon /> Yes
          </button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export { Component as AlertDialog, type AlertDialogProps };
