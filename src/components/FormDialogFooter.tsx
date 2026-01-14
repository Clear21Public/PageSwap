import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import * as Separator from '@radix-ui/react-separator';
import { Button } from './Button';
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
          <Button label="Cancel" />
        </Dialog.Close>
        <Form.Submit asChild>
          <Button className="green" icon="fa-check" label={submitButtonLabel} />
        </Form.Submit>
      </div>
    </>
  );
};
