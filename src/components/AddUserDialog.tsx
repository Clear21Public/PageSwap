import { useEffect, useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { UserRepository } from '../data/UserRepository'
import type { IUser } from '../types/IUser'
import type { AvatarId } from '../data/avatars'
import { AVATAR_IDS } from '../data/avatars'
import { UserAvatar } from './UserAvatar'
import { ValidationError } from '../errors'
import styles from './AddUserDialog.module.css'

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated: () => Promise<void> | void
}

interface FieldErrors {
  firstName?: string
  lastName?: string
  age?: string
  avatarId?: string
  form?: string
}

export function AddUserDialog({ open, onOpenChange, onUserCreated }: AddUserDialogProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [avatarId, setAvatarId] = useState<AvatarId | ''>('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showAvatars, setShowAvatars] = useState(true)

  const hasAnyChanges = useMemo(
    () => firstName !== '' || lastName !== '' || age !== '' || avatarId !== '',
    [firstName, lastName, age, avatarId]
  )

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setAge('')
    setAvatarId('')
    setErrors({})
    setIsSaving(false)
    setSaveError(null)
    setShowAvatars(true)
  }

  useEffect(() => {
    if (!open) {
      resetForm()
    } else {
      setErrors({})
      setSaveError(null)
    }
  }, [open])

  const validate = (): boolean => {
    const newErrors: FieldErrors = {}

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!age.trim()) {
      newErrors.age = 'Age is required'
    } else {
      const parsed = Number(age)
      if (Number.isNaN(parsed)) {
        newErrors.age = 'Age must be a valid number'
      } else if (parsed <= 0) {
        newErrors.age = 'Age must be greater than 0'
      }
    }

    if (!avatarId) {
      newErrors.avatarId = 'Please select an avatar'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaveError(null)

    if (!validate()) {
      return
    }

    const parsedAge = Number(age)

    const newUser: IUser = {
      id: crypto.randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: parsedAge,
      profileImageUrl: avatarId as string,
    }

    setIsSaving(true)

    try {
      await UserRepository.add(newUser)
      await onUserCreated()
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationErrors: FieldErrors = {}
        for (const propertyError of error.propertyErrors) {
          const key = propertyError.property as keyof FieldErrors
          validationErrors[key] = propertyError.message
        }
        setErrors((prev) => ({ ...prev, ...validationErrors }))
        setSaveError('Please fix the errors in the form and try again.')
      } else if (error instanceof Error) {
        setSaveError(error.message || 'Failed to save user.')
      } else {
        setSaveError('Failed to save user.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSaving) {
      return
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-label="Add user dialog">
          <div className={styles.headerRow}>
            <Dialog.Title className={styles.title}>Add User to System</Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.iconButton} aria-label="Close" disabled={isSaving}>
                <i className="fa-solid fa-xmark" />
              </button>
            </Dialog.Close>
          </div>

          {saveError && <div className={styles.saveError}>{saveError}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.avatarPreviewRow}>
              <div className={styles.avatarPreviewCard}>
                <UserAvatar avatarId={avatarId || ''} size={120} />
                <button
                  type="button"
                  className={styles.avatarSelectButton}
                  onClick={() => setShowAvatars((prev) => !prev)}
                  disabled={isSaving}
                >
                  <span>Select</span>
                  <i
                    className={`fa-solid ${showAvatars ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                  />
                </button>
              </div>
            </div>

            {showAvatars && (
              <div className={styles.avatarSection}>
                <div className={styles.avatarSectionHeader}>
                  <span className={styles.avatarSectionTitle}>Available Avatars</span>
                  {errors.avatarId && <span className={styles.errorText}>{errors.avatarId}</span>}
                </div>

                <div className={styles.avatarGrid} aria-label="Choose an avatar">
                  {AVATAR_IDS.map((id) => {
                    const selected = id === avatarId
                    return (
                      <button
                        key={id}
                        type="button"
                        className={`${styles.avatarButton} ${selected ? styles.avatarButtonSelected : ''}`}
                        onClick={() => setAvatarId(id)}
                        disabled={isSaving}
                      >
                        <UserAvatar avatarId={id} size={54} />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className={styles.fieldRow}>
              <label className={styles.label}>
                <span className={styles.labelText}>First Name <span className={styles.requiredMark}>*</span></span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                  disabled={isSaving}
                />
                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
              </label>

              <label className={styles.label}>
                <span className={styles.labelText}>Last Name <span className={styles.requiredMark}>*</span></span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                  disabled={isSaving}
                />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              </label>
            </div>

            <div className={styles.fieldRowSingle}>
              <label className={styles.label}>
                <span className={styles.labelText}>Age</span>
                <input
                  type="number"
                  min={1}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`${styles.input} ${errors.age ? styles.inputError : ''}`}
                  disabled={isSaving}
                />
                {errors.age && <span className={styles.errorText}>{errors.age}</span>}
              </label>
            </div>

            <div className={styles.footerRow}>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  disabled={isSaving || !hasAnyChanges}
                >
                  Cancel
                </button>
              </Dialog.Close>

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSaving}
              >
                {isSaving ? (
                  'Saving…'
                ) : (
                  <>
                    <i className="fa-solid fa-check" />
                    <span>Create</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
