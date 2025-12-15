import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label: ReactNode;
}

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  labelProps?: InputLabelProps;
  errorMessage?: string;
}

export const Input = ({ required, id, labelProps, errorMessage, ...props }: Props) => {
  return (
    <div className={styles.InputContainer}>
      <label id={id} className={styles.Label} {...labelProps}>
        {labelProps && labelProps.label}
        {required && <span className={styles.LabelRequired}>*</span>}
      </label>
      <input required={required} id={id} className={styles.Input} {...props} />
      <span id={id} className={styles.Error}>
        {errorMessage}
      </span>
    </div>
  );
};
