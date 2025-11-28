import { useMemo } from 'react'
import pickerStyles from './AvatarPicker.module.css'
import formStyles from '../FormInput/FormInput.module.css'

export interface Avatar {
  id: string
  url: string
}

interface AvatarPickerProps {
  value: string | undefined
  onChange: (avatar: Avatar) => void
  error?: string
  avatars: Avatar[]
  loading: boolean
  loadError: string | null
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ 
  value, 
  onChange, 
  error,
  avatars,
  loading,
  loadError
}) => {
  const pickerClasses = useMemo(() => {
    return `${pickerStyles.avatarPickerGrid} ${error ? pickerStyles.avatarPickerGridError : ''}`
  }, [error])

  if (loading) return <div className={pickerStyles.avatarPickerLoading}>Loading avatars...</div>
  if (loadError) return <div className={pickerStyles.avatarPickerError}>{loadError}</div>
  if (avatars.length === 0) return <div className={pickerStyles.avatarPickerError}>No avatars available.</div>
  
  return (
    <div className={formStyles.formGroup}>
      <div className={pickerClasses} role='radiogroup' aria-required='true' aria-invalid={!!error}>
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            type='button'
            className={`${pickerStyles.avatarOption} ${value === avatar.id ? pickerStyles.avatarOptionSelected : ''}`}
            onClick={() => onChange(avatar)}
            aria-checked={value === avatar.id}
            role='radio'
          >
            <img src={avatar.url} alt={`Avatar option ${avatar.id}`} className={pickerStyles.avatarImage} />
          </button>
        ))}
      </div>
      {error && <p className={formStyles.formErrorMessage} role='alert'>{error}</p>}
    </div>
  )
}