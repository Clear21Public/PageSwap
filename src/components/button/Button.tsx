import type { ButtonHTMLAttributes } from 'react';
// import cn from 'classnames';

import { Icon } from '../icon/Icon';
import type { Props as IconProps } from '../icon/Icon';

import styles from './Button.module.css';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  leftIcon?: IconProps['icon'];
  iconProps?: Omit<IconProps, 'icon'>;
}

export const Button = ({ children, variant = 'primary', leftIcon, iconProps, ...props }: Props) => (
  <button className={`${styles.btn} ${styles[variant]}`} {...props}>
    {leftIcon && <Icon className={styles.icon} icon={leftIcon} {...iconProps} />}
    {children}
  </button>
);
