import { useEffect } from 'react';
import styles from './Toast.module.css';

interface Props {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: Props) {
  useEffect(() => {
    if (!onClose) return;
    const t = setTimeout(() => onClose(), duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className={`${styles.toast} ${type === 'success' ? styles.success : ''}`} role="status" aria-live="polite">
      <div>{message}</div>
      {onClose && (
        <button className={styles.closeBtn} aria-label="Close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}
