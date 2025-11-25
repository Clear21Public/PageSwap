import { forwardRef, type InputHTMLAttributes } from 'react'
import styles from './FormInput.module.css'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    
    const isRequired = props.required ?? false

    return (
      <div className={styles.formGroup}>
        <label htmlFor={props.id || props.name} className={styles.formLabel}>
          {label}
          {isRequired && (
            <span className={styles.requiredMarker} aria-hidden='true'>*</span>
          )}
        </label>
        <input
          ref={ref}
          className={`${styles.formInput} ${error ? styles.formInputError : ''} ${className}`}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className={styles.formErrorMessage} role='alert'>{error}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'