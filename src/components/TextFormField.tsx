import type React from 'react';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input } from './input';
import { Field, FieldError, FieldLabel } from './Field';

export function TextFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: {
    control: Control<TFieldValues>;
    description?: React.ReactNode;
    label?: React.ReactNode;
    name: TName;
  } & React.ComponentPropsWithoutRef<typeof Input>
) {
  const { control /* , description */, label, name, ...inputProps } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          {typeof label === 'string' ? <FieldLabel aria-required={props.required}>{label}</FieldLabel> : label}
          {/* {typeof description === 'string' ? <FormDescription>{description}</FormDescription> : description} */}
          <Input
            data-error={!!fieldState.error}
            {...inputProps}
            {...field}
            onBlur={(e) => {
              field.onBlur();
              inputProps.onBlur?.(e);
            }}
          />
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  );
}
