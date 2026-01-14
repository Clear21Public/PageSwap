import * as Form from '@radix-ui/react-form';
import styles from './Form.module.css';

interface TextInputProps<T> extends React.InputHTMLAttributes<T> {
  label: string;
}

export const TextInput = ({ label, required, ...inputProps }: TextInputProps) => {
  return (
    <Form.Field className={styles.Field} name={label}>
      <Form.Label className={styles.Label}>{label}</Form.Label>
      <Form.Control asChild>
        <input className={styles.Input} type="text" required={required} {...inputProps} />
      </Form.Control>
      {required && (
        <Form.Message className={styles.Message} match="valueMissing">
          Please enter a value
        </Form.Message>
      )}
    </Form.Field>
  );
};
