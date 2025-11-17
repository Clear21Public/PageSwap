import { useEffect, useState } from 'react'
import { BaseDialog } from './BaseDialog'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => Promise<void> | void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false)
      setError(null)
    }
  }, [open])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) {
      return
    }
    onOpenChange(nextOpen)
  }

  const handleConfirm = async () => {
    setError(null)
    setIsSubmitting(true)

    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong. Please try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      ariaLabel={title}
      isSaving={isSubmitting}
      body={
        <>
          <p id="confirm-dialog-description" className={styles.description}>
            {description}
          </p>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </>
      }
      footer={
        <>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting && <span className={styles.spinner} aria-hidden="true" />}
            <>
              <i className="fa-solid fa-check" />
              <span>{confirmLabel}</span>
            </>
          </button>
        </>
      }
    />
  )
}
