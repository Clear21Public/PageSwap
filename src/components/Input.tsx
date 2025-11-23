import { type InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: boolean;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className || ''}`.trim()}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

