import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import styles from './AddUserButton.module.css';

interface FormDialogFooterProps {
  submitButtonLabel: string;
}

export const FormDialogFooter = ({ submitButtonLabel }: FormDialogFooterProps) => {
  return (
    <div className={styles.Footer}>
      <Dialog.Close asChild>
        <button className={`${styles.Button}`}>Cancel</button>
      </Dialog.Close>
      <Form.Submit asChild>
        <button className={`${styles.Button} green`}>
          <i className="fa-solid fa-check" />
          {submitButtonLabel}
        </button>
      </Form.Submit>
    </div>
  );
};
