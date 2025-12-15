import { Footer, Modal } from '../Modal';
import { useAddUserStore } from '../../../stores/user';
import { Button } from '../../button/Button';
import { ADD_USER_FORM_ID, AddUserForm } from '../../form/AddUserForm';
import { FormProvider, useForm } from 'react-hook-form';
import type { IAddUserForm } from '../../../types/IUser';

export const AddUserModal = () => {
  const { isModalOpen, setIsModalOpen } = useAddUserStore((state) => state);

  const methods = useForm<IAddUserForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title={'Add User to System'}
        trigger={
          <Button variant="secondary" leftIcon="plus">
            Add user
          </Button>
        }
        body={
          <div>
            <AddUserForm></AddUserForm>
          </div>
        }
        footer={
          <Footer
            cancelButtonProps={{
              onClick: handleCancel,
              label: 'Cancel',
            }}
            submitButtonProps={{
              form: ADD_USER_FORM_ID,
              type: 'submit',
              onClick: () => {},
              variant: 'secondary',
              label: 'Create',
              leftIcon: 'check',
            }}
          />
        }
      />
    </FormProvider>
  );
};
