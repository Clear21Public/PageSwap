import { type ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { Cross2Icon } from '@radix-ui/react-icons';
import styles from './Dialog.module.css';

interface DialogProps {
  title: string;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Component = ({ open, onOpenChange, title, children }: DialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          <Dialog.Close asChild>
            <button className={styles.close} aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
          <Dialog.Description />
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { Component as Dialog, type DialogProps };
