import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { clsx } from 'clsx';
import styles from './Dialog.module.css';
import { ModalHeading } from './typography';

/**
 * Root dialog component that manages the open/closed state.
 * Wrapper around {@link https://www.radix-ui.com/primitives/docs/components/dialog | Radix UI Dialog Root primitive}.
 *
 * Usage is similar to {@link https://ui.shadcn.com/docs/components/dialog | shadcn/ui Dialog component},
 * with the addition of the <DialogScroller/> to accommodate our design system.
 *
 * @param props - All props from Radix UI Dialog Root
 * @returns The dialog root element
 */
export function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * Trigger element that opens the dialog when activated.
 * Wrapper around Radix UI Dialog Trigger primitive.
 *
 * @param props - All props from Radix UI Dialog Trigger
 * @returns The dialog trigger element
 */
export function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * Portal component that renders dialog content in a different part of the DOM.
 * Wrapper around Radix UI Dialog Portal primitive.
 *
 * @param props - All props from Radix UI Dialog Portal
 * @returns The dialog portal element
 */
export function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DefaultDialogCloseChildren() {
  return (
    <>
      <FontAwesomeIcon icon={faXmark} />
      <span className={styles.srOnly}>Close</span>
    </>
  );
}

/**
 * Pre-styled close button with X icon and accessibility features.
 * Wrapper around Radix UI Dialog Close primitive.
 *
 * @param props - All props from Radix UI Dialog Close
 * @returns A styled close button with X icon
 */
export function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  const { className, children, ...dialogCloseProps } = props;
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      {...dialogCloseProps}
      className={clsx(styles.dialogClose, className)}
    >
      {children ?? <DefaultDialogCloseChildren />}
    </DialogPrimitive.Close>
  );
}

/**
 * Overlay component that renders behind the dialog content.
 * Includes default styling for backdrop appearance.
 *
 * @param props - All props from Radix UI Dialog Overlay
 * @param props.className - Additional CSS classes to apply
 * @returns The dialog overlay element with styling
 */
export function DialogOverlay(props: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const { className, ...dialogOverlayProps } = props;
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      {...dialogOverlayProps}
      className={clsx(styles.dialogOverlay, className)}
    />
  );
}

export type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
};

/**
 * Main dialog content container with optional close button.
 * Automatically includes portal and overlay, with configurable close button.
 *
 * For usage examples and patterns, see: {@link https://ui.shadcn.com/docs/components/dialog | Dialog - shadcn/ui}
 *
 * @param props - All props from Radix UI Dialog Content
 * @param props.className - Additional CSS classes to apply
 * @param props.children - Content to display in the dialog
 * @param props.showCloseButton - Whether to show the close button (defaults to true)
 * @returns The complete dialog content with portal, overlay, and optional close button
 */
export function DialogContent(props: DialogContentProps) {
  const { className, children, showCloseButton = true, ...dialogProps } = props;
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={clsx(styles.dialogContent, className)}
        {...dialogProps}
      >
        {children}
        {showCloseButton && <DialogClose />}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * Header section for dialog content with default styling.
 * Typically contains the dialog title and other header elements.
 *
 * @param props - Standard div element props
 * @param props.className - Additional CSS classes to apply
 * @returns A styled header container for dialog content
 */
export function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={clsx(styles.dialogHeader, className)} {...props} />;
}

/**
 * Footer section for dialog content with default styling.
 * Typically contains action buttons and other footer elements.
 *
 * @param props - Standard div element props
 * @param props.className - Additional CSS classes to apply
 * @returns A styled footer container for dialog content
 */
export function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={clsx(styles.dialogFooter, className)} {...props} />;
}

/**
 * Dialog title component with proper semantic heading structure.
 * Uses ModalHeading component for consistent styling and accessibility.
 *
 * @param props - All props from Radix UI Dialog Title
 * @param props.className - Additional CSS classes to apply
 * @param props.children - The title text content
 * @returns A properly styled and accessible dialog title
 */
export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title {...props} data-slot="dialog-title" className={clsx(styles.dialogTitle, className)} asChild>
      <ModalHeading>{props.children}</ModalHeading>
    </DialogPrimitive.Title>
  );
}

/**
 * Scrollable container for dialog content that may overflow.
 * Provides consistent scrolling behavior within dialog bounds.
 *
 * @param props - Standard div element props
 * @param props.className - Additional CSS classes to apply
 * @param props.children - Content that may need scrolling
 * @returns A scrollable container for dialog content
 */
export function DialogScroller({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={clsx(styles.dialogScroller, className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Description component for additional dialog context.
 * Provides accessible description text for screen readers.
 *
 * @param props - All props from Radix UI Dialog Description
 * @param props.className - Additional CSS classes to apply
 * @returns A styled description element for dialog content
 */
export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={clsx(styles.dialogDescription, className)}
      {...props}
    />
  );
}
