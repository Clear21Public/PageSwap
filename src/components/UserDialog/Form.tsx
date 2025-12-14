import * as Form from '@radix-ui/react-form';
import formStyles from './Form.module.css';
import { AVATAR_IDS, useUserRepository, ValidationError, type AvatarId } from '../../repositories';
import { useState, type FormEvent } from 'react';
import type { IUser } from '../../types/IUser';
import type { IPropertyError } from '../../types/IValidationError';

// TODO: break components up into their own places
// AvatarSelect -- can stay in UserDialog
// UserForm - can be re-factored for shared form in future
// FormField - more general, can be shared

function AvatarSelect() {
  const [avatarId, setAvatarId] = useState<AvatarId | undefined>()
  const [open, setOpen] = useState<boolean>(false)

  const currentImage = avatarId ? `./assets/${avatarId}.jpg` : './assets/placeholder-dp.png';

  return(
    <Form.Field name="profileImageId">
      <div style={{ width: 125 }} onClick={() => setOpen(!open)}>
        <img style={{ width: '100%' }} src={currentImage} alt="default user image" />
        <div>Select {open ? <i className="fa-solid fa-chevron-up" /> : <i className="fa-solid fa-chevron-down" />}</div>
      </div>
      <Form.Control asChild>
        {open && <div style={{display: 'flex', width: '100%', flexWrap: 'wrap'}}>
          <input type="hidden" value={avatarId} />
          {AVATAR_IDS.map((id) => {
            return(
                <img style={{ width: 60, height: 60}} src={`./assets/${id}.jpg`} alt="default user image" key={id} onClick={() => setAvatarId(id)} />
            )
          })}
        </div>
        }
      </Form.Control>
    </Form.Field>
  )
}

function parseUserData(data: {[k: string]: FormDataEntryValue}): IUser {
  // TODO: Pass id generation to userRepository
  return {
    id: crypto.randomUUID(),
    firstName: data.firstName.toString(),
    lastName: data.lastName.toString(),
    age: Number(data.age),
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

function FormField({ name, label, type = "text", min, required, disabled, errors }: FormFieldProps) {
  return (
    <Form.Field className={formStyles.Field} name={name}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <Form.Label className={formStyles.Label}>{label}</Form.Label>
        {required && <span>*</span> }
      </div>
      <Form.Control
        className={formStyles.Input}
        type={type}
        min={min}
        disabled={disabled}
        required={required}
      />
      <Form.Message className={formStyles.Message} match="valueMissing">
        Please enter a value
      </Form.Message>
      {errors.length > 0 && (errors.map((error, index) => {
        return(
          <Form.Message key={`${error.property}-${index}`}>
            {error.message}
          </Form.Message>
        )
      }))}
    </Form.Field>
  )
}

export function UserForm({ formId }: { formId: string; }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<IPropertyError[]>([])
  const userRepository = useUserRepository();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      setErrors([])
      setLoading(true)
      await userRepository.add(parseUserData(data))
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
      className={formStyles.Root}
      onSubmit={handleSubmit}
    >
      <AvatarSelect />
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
