import * as Form from '@radix-ui/react-form';
import styles from './Form.module.css';
import { useUserRepository, ValidationError, type AvatarId } from '../../repositories';
import { useState, type FormEvent } from 'react';
import type { IUser } from '../../types/IUser';
import type { IPropertyError } from '../../types/IValidationError';
import { AvatarSelect } from './AvatarSelect';

// TODO separate out parseUserData and FormFieldProps
function parseUserData(data: {[k: string]: FormDataEntryValue}): IUser {
  // TODO: Pass id generation to userRepository
  return {
    id: crypto.randomUUID(),
    firstName: data.firstName.toString(),
    lastName: data.lastName.toString(),
    age: data.age ? Number(data.age) : undefined,
    profileImageUrl: data.profileImageUrl?.toString()
  }
}

type FormFieldProps = {
  name: string;
  label: string;
  type?: "text" | "number";
  min?: number;
  disabled?: boolean;
  required?: boolean;
  errors: IPropertyError[];
}

// TODO fix server error functionality
function FormField({ name, label, type = "text", min, required, disabled, errors }: FormFieldProps) {

  return (
    <Form.Field className={styles.Field} name={name}>
      <div className={styles.Label}>
        <Form.Label>{label}</Form.Label>
        {required && <span className={styles.Asterisk}>*</span> }
      </div>
      <Form.ValidityState>
        {(validityError) => {
          if (validityError?.valueMissing || errors.length > 0) {
            return(
              <Form.Control
                className={styles.InputError}
                type={type}
                min={min}
                disabled={disabled}
                required={required}
              />
            )
          } else {
            return(
              <Form.Control
                className={styles.Input}
                type={type}
                min={min}
                disabled={disabled}
                required={required}
              />
            )
          }
        }}
      </Form.ValidityState>
      <Form.Message className={styles.Message} match="valueMissing">
        Please enter a value
      </Form.Message>
      {errors.length > 0 && (errors.map((error, index) => {
        return(
          <Form.Message className={styles.Message} key={`${error.property}-${index}`}>
            {error.message}
          </Form.Message>
        )
      }))}
    </Form.Field>
  )
}

export function UserForm({ formId }: { formId: string; }) {
  const [loading, setLoading] = useState(false)
  const [avatarId, setAvatarId] = useState<AvatarId | undefined>()
  const [errors, setErrors] = useState<IPropertyError[]>([])
  const userRepository = useUserRepository();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      setErrors([])
      setLoading(true)
      let userData = parseUserData(data);
      if (avatarId) {
        userData = { ...userData, profileImageUrl: avatarId }
      }

      await userRepository.add(userData)
    } catch(e: unknown) {
      if (e instanceof ValidationError) {
        setErrors(e.propertyErrors);
      } else {
        console.log('*** error caught', e);
      }
    }
    setLoading(false)
    
    // prevent default form submission
    event.preventDefault();
  }

  return (
    <Form.Root
      id={formId}
      onSubmit={handleSubmit}
    >
      <AvatarSelect avatarId={avatarId} setAvatarId={setAvatarId} />
      <FormField
        name={'firstName'}
        label={'First Name'}
        disabled={loading}
        required
        errors={errors.filter(error => error.property === 'firstName')}
      />
      <FormField
        name={'lastName'}
        label={'Last Name'}
        required
        disabled={loading}
        errors={errors.filter(error => error.property === 'lastName')}
      />
      <FormField
        name={'age'}
        label={'Age'}
        type={"number"}
        disabled={loading}
        errors={errors.filter(error => error.property === 'age')}
      />
    </Form.Root>
  )
}
