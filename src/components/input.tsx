import * as React from 'react';
import { clsx } from 'clsx';
import styles from './form-controls.module.css';

export function Input(props: React.ComponentProps<'input'>) {
  const { className, ...inputProps } = props;
  return <input data-slot="input" className={clsx(styles.formControl, className)} {...inputProps} />;
}
