import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';
import base from '../styles/base.module.css';
import styles from './Input.module.css';

// id is required when label is provided
type LabeledInputProps =
  | { label: string; id: string }
  | { label?: undefined; id?: string };

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> &
  LabeledInputProps & {
    required?: boolean;
    error?: string;
  };

const Input = ({ id, label, error, required, ...inputProps }: InputProps) => (
  <div className={styles.root}>
    <div>
      {label && (
        <label htmlFor={id} className={base.label}>
          {label}
        </label>
      )}
      {required && <span className={styles.required}>*</span>}
    </div>
    <input
      {...inputProps}
      id={id}
      className={clsx(styles.input, error && styles.inputError)}
    />
    {error && <p className={styles.error}>{error}</p>}
  </div>
);

export { Input, type InputProps };
