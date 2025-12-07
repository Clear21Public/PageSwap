import { clsx } from 'clsx';
import styles from './buttons.module.css';
import type { ButtonSize, ButtonVariant } from './buttons.types';

export function commonButtonClassNames(variant: ButtonVariant, size: ButtonSize) {
  return clsx(
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'danger' && styles.danger,
    variant === 'success' && styles.success,
    variant === 'ghost' && styles.ghost,
    size === 'medium' && styles.medium,
    size === 'large' && styles.large
  );
}
