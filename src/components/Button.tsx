import styles from './Button.module.css';

interface ButtonProps {
  className?: string;
  icon?: string;
  label: string;
  onClick?: () => void;
}

export const Button = ({ className, icon, label, onClick }: ButtonProps) => {
  return (
    <button className={`${styles.Button} ${className}`} onClick={onClick}>
      {icon && <i className={`fa-solid ${icon}`} />}
      {label}
    </button>
  );
};
