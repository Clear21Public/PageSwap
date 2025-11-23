import { type ReactNode } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function FormField({ id, label, required, error, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      {children}
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
}

