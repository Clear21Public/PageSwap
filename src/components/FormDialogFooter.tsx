import * as Dialog from '@radix-ui/react-dialog';
import * as Separator from '@radix-ui/react-separator';
import * as Form from '@radix-ui/react-form';
import styles from './Button.module.css';
import dialogStyles from './Dialog.module.css';

interface FormDialogFooterProps {
  submitButtonLabel: string;
}

export const FormDialogFooter = ({ submitButtonLabel }: FormDialogFooterProps) => {
  return (
    <>
      <Separator.Root className={dialogStyles.Separator} />
      <div className={dialogStyles.Footer}>
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
    </>
  );
};
