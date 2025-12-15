import type { ButtonHTMLAttributes } from 'react';

import styles from './Button.module.css';
import type { Icon } from '../../types/IIcon';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  leftIcon?: Icon;
  iconType: 'danger';
}

export const Button = ({ children, variant = 'primary', iconType, leftIcon, ...props }: Props) => (
  <button className={`${styles.btn} ${styles[variant]}`} {...props}>
    {leftIcon && <i className={`fa-solid fa-${leftIcon} ${styles[iconType]}`} />}
    {children}
  </button>
);
