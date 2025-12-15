import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Root,
} from '@radix-ui/react-dialog';
import { Button, type Props as ButtonProps } from '../button/Button';

import styles from './Modal.module.css';
import type { ReactNode } from 'react';

interface FooterButtonProps extends Omit<ButtonProps, 'children'> {
  label: ReactNode;
}

interface FooterProps {
  submitButtonProps: FooterButtonProps;
  cancelButtonProps?: FooterButtonProps;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  body: ReactNode;
  title: ReactNode;
  trigger: ReactNode;
  footer?: ReactNode;
}

export const Footer = ({ submitButtonProps, cancelButtonProps }: FooterProps) => (
  <footer className={styles.Footer}>
    {cancelButtonProps && <Button {...cancelButtonProps}>{cancelButtonProps.label}</Button>}
    <Button {...submitButtonProps}>{submitButtonProps.label}</Button>
  </footer>
);

export const Modal = ({ body, footer, title, trigger, isOpen, setIsOpen }: Props) => {
  console.log('___', isOpen);
  return (
    <Root open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={styles.Overlay} />
        <DialogContent className={styles.Content} onInteractOutside={() => setIsOpen(false)}>
          <DialogTitle className={styles.Title}>{title}</DialogTitle>
          <div className={styles.Body}>{body}</div>

          {footer}
        </DialogContent>
      </DialogPortal>
    </Root>
  );
};
