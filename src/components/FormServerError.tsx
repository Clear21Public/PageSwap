import styles from './AddUserButton.module.css';

interface FormServerErrorProps {
  error: any;
}

export const FormServerError = ({ error }: FormServerErrorProps) => {
  return error ? (
    <div className={`${styles.ServerError} ${styles.Message}`}>An error occurred submitting the form</div>
  ) : null;
};
