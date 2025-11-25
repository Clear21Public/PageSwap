import * as Dialog from '@radix-ui/react-dialog'
import { useState, useMemo, useEffect, useCallback, type ReactNode } from 'react'
import { useUserRepository, useImageRepository } from '../../repositories'
import { FormInput } from '../FormInput/FormInput'
import { AvatarPicker, type Avatar } from '../AvatarPicker/AvatarPicker'
import { AVATAR_IDS } from '../../repositories/avatars'
import styles from './AddUserDialog.module.css'
import type { IUser } from '../../types/IUser'

interface AddUserDialogProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

interface UserFormData {
  firstName: string
  lastName: string
  age: number | ''
  avatarId: string | undefined
}

interface FormErrors {
  firstName?: string
  lastName?: string
  age?: string
  avatarId?: string
}

const defaultFormData: UserFormData = {
  firstName: '',
  lastName: '',
  age: '',
  avatarId: AVATAR_IDS[0]
}

const PLACEHOLDER_AVATAR_URL = '/assets/placeholder-dp.png';

export const AddUserDialog: React.FC<AddUserDialogProps> = ({isOpen, onClose, children}) => {
  const userRepository = useUserRepository()
  const { get: getImage } = useImageRepository()
  const [formData, setFormData] = useState<UserFormData>(defaultFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [showAvatarSelector, setShowAvatarSelector] = useState<boolean>(false)
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [avatarsLoading, setAvatarsLoading] = useState<boolean>(true)
  const [avatarsLoadError, setAvatarsLoadError] = useState<string | null>(null)

  const loadAvatars = useCallback(async () => {
    setAvatarsLoading(true)
    setAvatarsLoadError(null)

    try {
      const avatarPromises = AVATAR_IDS.map(async (id) => ({
        id,
        url: await getImage(`${id}.jpg`)
      }))
      const loadedAvatars = await Promise.all(avatarPromises)
      setAvatars(loadedAvatars)
    } catch {
      setAvatarsLoadError('Failed to load avatars.')
    } finally {
      setAvatarsLoading(false)
    }
  }, [getImage])

  useEffect(() => {
    loadAvatars()
  }, [loadAvatars])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    const { firstName, lastName, age, avatarId } = formData

    if (!firstName.trim()) {
      newErrors.firstName = 'First Name is required.'
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last Name is required.'
    }
    if (age === '' || typeof age !== 'number' || isNaN(age) || age <= 0) {
      newErrors.age = 'Age is required and must be a number greater than 0.'
    }
    if (!avatarId) {
      newErrors.avatarId = 'An avatar must be selected.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    
    let processedValue: string | number | ''
    if (type === 'number') {
      processedValue = value ? parseInt(value, 10) : ''
    } else {
      processedValue = value
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSubmitError(null)
    setSubmitSuccess(false)
  }

  const handleAvatarChange = (avatar: Avatar) => {
    setFormData((prev) => ({ ...prev, avatarId: avatar.id }))
    setSelectedAvatar(avatar)
    setShowAvatarSelector(false) 
    setErrors((prev) => ({ ...prev, avatarId: undefined }))
    setSubmitError(null)
    setSubmitSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const profileImageUrl = selectedAvatar?.url || await getImage(`${formData.avatarId}.jpg`) 
      
      const userToAdd: IUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age as number, 
        profileImageUrl: profileImageUrl,
        id: 'client-temp-id'
      }

      await userRepository.add(userToAdd)

      setSubmitSuccess(true);
      onClose();
    } catch {
      setSubmitError('Failed to create user. Please check server logs.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const isFormDisabled = isSubmitting || submitSuccess
  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors])
  const isFormComplete = !!formData.firstName && !!formData.lastName && formData.age !== '' && !!formData.avatarId

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Add User to System</Dialog.Title>
          <div className={styles.dialogBody}>
            <form onSubmit={handleSubmit}>
              <div className={styles.selectedAvatarPreview}>
                <img 
                  src={selectedAvatar?.url || PLACEHOLDER_AVATAR_URL} 
                  alt="Selected Avatar" 
                  className={styles.selectedAvatarImage} 
                />
                <button
                  type="button"
                  className={styles.selecteAvatarButton}
                  onClick={() => setShowAvatarSelector(prev => !prev)}
                >
                  Select
                  <span className={`material-icons-outlined ${styles.selectIcon}`}>
                    {showAvatarSelector ? 'arrow_drop_up' : 'arrow_drop_down'}
                  </span>
                </button>
              </div>

              {showAvatarSelector && 
                <AvatarPicker
                  value={formData.avatarId}
                  onChange={handleAvatarChange}
                  error={errors.avatarId}
                  avatars={avatars}
                  loading={avatarsLoading}
                  loadError={avatarsLoadError}
                />
              }
              
              <FormInput
                id='firstName'
                name='firstName'
                label='First Name'
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                disabled={isFormDisabled}
                onBlur={() => validate()}
                required
              />

              <FormInput
                id='lastName'
                name='lastName'
                label='Last Name'
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                disabled={isFormDisabled}
                onBlur={() => validate()}
                required
              />

              <FormInput
                id='age'
                name='age'
                label='Age'
                type='number'
                min='1'
                value={formData.age}
                onChange={handleChange}
                error={errors.age}
                disabled={isFormDisabled}
                onBlur={() => validate()}
                required
              />
              
              <div className={styles.dialogFooter}>
                {submitError && <p className={styles.submitError} role='alert'>{submitError}</p>}
                {submitSuccess && <p className={styles.submitSuccess}>User added successfully!</p>}
                
                <Dialog.Close asChild>
                  <button type='button' className={`${styles.button} ${styles.buttonSecondary}`} disabled={isSubmitting} onClick={onClose}>
                    Cancel
                  </button>
                </Dialog.Close>

                <button
                  type='submit'
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  disabled={isFormDisabled || hasErrors || !isFormComplete}
                >
                  {isSubmitting ? 'Saving...' : 'Create'}
                </button>
              </div>
            </form>
            <Dialog.Close asChild>
              <button className={styles.dialogCloseButton} aria-label='Close' disabled={isSubmitting} onClick={onClose}>
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}