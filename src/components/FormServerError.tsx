import styles from './Form.module.css';

interface FormServerErrorProps {
  error: unknown;
}

export const FormServerError = ({ error }: FormServerErrorProps) => {
  return error ? (
    <div className={`${styles.ServerError} ${styles.Message}`}>An error occurred submitting the form</div>
  ) : null;
};
