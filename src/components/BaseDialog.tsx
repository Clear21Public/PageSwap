import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import styles from './BaseDialog.module.css'

interface BaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  ariaLabel: string
  isSaving?: boolean
  body: ReactNode
  footer: ReactNode
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  ariaLabel,
  isSaving,
  body,
  footer,
}: BaseDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-label={ariaLabel}>
          <section className={styles.headerRow}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.iconButton} aria-label="Close" disabled={isSaving}>
                <i className="fa-solid fa-xmark" />
              </button>
            </Dialog.Close>
          </section>

          <section className={styles.mainContent}>{body}</section>
          <section className={styles.footerRow}>{footer}</section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
