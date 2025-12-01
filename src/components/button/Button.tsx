import { clsx } from 'clsx';
import styles from './Button.module.css';

type ButtonProps = {
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: ButtonProps) => {
  const { className, ...rest } = props;
  return (
    <button className={clsx(className, styles.button)} {...rest}>
      {children}
    </button>
  );
};
