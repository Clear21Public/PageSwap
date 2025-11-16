import type { InputHTMLAttributes } from 'react';
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
  <div>
    {label && <label htmlFor={id}>{label}</label>}
    {required && <span>*</span>}
    <input {...inputProps} id={id} className={styles.input} />
    {error && <p>{error}</p>}
  </div>
);

export { Input, type InputProps };
