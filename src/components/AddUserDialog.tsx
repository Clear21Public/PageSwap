import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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

type FormValues = {
  firstName: string
  lastName: string
  age: string
  avatarId: AvatarId | ''
}

export function AddUserDialog({ open, onOpenChange, onUserCreated }: AddUserDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      age: '',
      avatarId: '',
    },
  })

  const avatarId = watch('avatarId')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showAvatars, setShowAvatars] = useState(false)

  useEffect(() => {
    if (!open) {
      reset()
      setIsSaving(false)
      setSaveError(null)
      setShowAvatars(false)
    } else {
      setSaveError(null)
    }
  }, [open, reset])

  const onSubmit = async (data: FormValues) => {
    setSaveError(null)

    const trimmedAge = data.age.trim()
    const parsedAge = trimmedAge ? Number(trimmedAge) : undefined

    const newUser: IUser = {
      id: crypto.randomUUID(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      age: parsedAge,
      profileImageUrl: data.avatarId || 'placeholder-dp',
    }

    setIsSaving(true)

    try {
      await UserRepository.add(newUser)
      await onUserCreated()
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ValidationError) {
        for (const propertyError of error.propertyErrors) {
          const key = propertyError.property as keyof FormValues
          if (key === 'firstName' || key === 'lastName' || key === 'age' || key === 'avatarId') {
            setError(key, { type: 'server', message: propertyError.message })
          }
        }
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
          <section className={styles.headerRow}>
            <Dialog.Title className={styles.title}>Add User to System</Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.iconButton} aria-label="Close" disabled={isSaving}>
                <i className="fa-solid fa-xmark" />
              </button>
            </Dialog.Close>
          </section>

          {saveError && <div className={styles.saveError}>{saveError}</div>}

          <section className={styles.mainContent}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.avatarPreviewRow}>
                <div className={styles.avatarPreviewCard}>
                  <UserAvatar avatarId={avatarId || ''} size={125} />
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
                    {errors.avatarId && <span className={styles.errorText}>{errors.avatarId.message}</span>}
                  </div>

                  <div className={styles.avatarGrid} aria-label="Choose an avatar">
                    {AVATAR_IDS.map((id) => {
                      const selected = id === avatarId
                      return (
                        <button
                          key={id}
                          type="button"
                          className={`${styles.avatarButton} ${selected ? styles.avatarButtonSelected : ''}`}
                          onClick={() => setValue('avatarId', id, { shouldDirty: true })}
                          disabled={isSaving}
                        >
                          <UserAvatar avatarId={id} size={54} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className={styles.fieldRowSingle}>
                <label className={styles.label}>
                  <span className={styles.labelText}>First Name <span className={styles.requiredMark}>*</span></span>
                  <input
                    type="text"
                    {...register('firstName', {
                      required: 'First name is required',
                      validate: (value: string) => value.trim() !== '' || 'First name is required',
                    })}
                    className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                    disabled={isSaving}
                  />
                  {errors.firstName && <span className={styles.errorText}>{errors.firstName.message}</span>}
                </label>
              </div>

              <div className={styles.fieldRowSingle}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Last Name <span className={styles.requiredMark}>*</span></span>
                  <input
                    type="text"
                    {...register('lastName', {
                      required: 'Last name is required',
                      validate: (value: string) => value.trim() !== '' || 'Last name is required',
                    })}
                    className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                    disabled={isSaving}
                  />
                  {errors.lastName && <span className={styles.errorText}>{errors.lastName.message}</span>}
                </label>
              </div>

              <div className={styles.fieldRowSingle}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Age</span>
                  <input
                    type="number"
                    min={1}
                    {...register('age', {
                      validate: (value: string) => {
                        const trimmedAge = value.trim()
                        if (!trimmedAge) {
                          return true
                        }
                        const parsedAge = Number(trimmedAge)
                        if (Number.isNaN(parsedAge)) {
                          return 'Age must be a valid number'
                        }
                        if (parsedAge <= 0) {
                          return 'Age must be greater than 0'
                        }
                        return true
                      },
                    })}
                    className={`${styles.input} ${errors.age ? styles.inputError : ''}`}
                    disabled={isSaving}
                  />
                  {errors.age && <span className={styles.errorText}>{errors.age.message}</span>}
                </label>
              </div>
            </form>
          </section>
          <section className={styles.footerRow}>
              <Dialog.Close asChild>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </Dialog.Close>

                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={isSaving}
                  onClick={handleSubmit(onSubmit)}
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
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
