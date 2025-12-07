import { useMemo } from 'react';
import { clsx } from 'clsx';
import { Label } from './Label';
// import { Separator } from '../Separator/Separator';
import styles from './Field.module.css';

type FieldSetProps = React.ComponentProps<'fieldset'>;

function FieldSet(props: FieldSetProps) {
  const { className, ...fieldSetProps } = props;

  return (
    <fieldset
      data-slot="field-set"
      className={clsx('reactui-FieldSet', styles.fieldSet, className)}
      {...fieldSetProps}
    />
  );
}

type FieldLegendProps = React.ComponentProps<'legend'> & {
  variant?: 'legend' | 'label';
};

function FieldLegend(props: FieldLegendProps) {
  const { className, variant = 'legend', ...legendProps } = props;

  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={clsx(
        styles.fieldLegend,
        {
          [styles.fieldLegendVariantLegend]: variant === 'legend',
          [styles.fieldLegendVariantLabel]: variant === 'label',
        },
        className
      )}
      {...legendProps}
    />
  );
}

type FieldGroupProps = React.ComponentProps<'div'>;

function FieldGroup(props: FieldGroupProps) {
  const { className, ...fieldGroupProps } = props;

  return <div data-slot="field-group" className={clsx(styles.fieldGroup, className)} {...fieldGroupProps} />;
}

type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

type FieldProps = React.ComponentProps<'div'> & {
  orientation?: FieldOrientation;
};

function Field(props: FieldProps) {
  const { className, orientation = 'vertical', ...fieldProps } = props;

  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={clsx(
        styles.field,
        {
          [styles.fieldOrientationVertical]: orientation === 'vertical',
          [styles.fieldOrientationHorizontal]: orientation === 'horizontal',
          [styles.fieldOrientationResponsive]: orientation === 'responsive',
        },

        className
      )}
      {...fieldProps}
    />
  );
}

type FieldContentProps = React.ComponentProps<'div'>;

function FieldContent(props: FieldContentProps) {
  const { className, ...rest } = props;

  return <div data-slot="field-content" className={clsx(styles.fieldContent, className)} {...rest} />;
}

type FieldLabelProps = React.ComponentProps<typeof Label>;

function FieldLabel(props: FieldLabelProps) {
  const { className, ...rest } = props;

  return <Label data-slot="field-label" className={clsx(styles.fieldLabel, className)} {...rest} />;
}

type FieldTitleProps = React.ComponentProps<'div'>;

function FieldTitle(props: FieldTitleProps) {
  const { className, ...rest } = props;

  return <div data-slot="field-label" className={clsx(styles.fieldTitle, className)} {...rest} />;
}

type FieldDescriptionProps = React.ComponentProps<'p'>;

function FieldDescription(props: FieldDescriptionProps) {
  const { className, ...rest } = props;

  return <p data-slot="field-description" className={clsx(styles.fieldDescription, className)} {...rest} />;
}

// type FieldSeparatorProps = React.ComponentProps<'div'> & {
//   children?: React.ReactNode;
// };

// function FieldSeparator(props: FieldSeparatorProps) {
//   const { children, className, ...rest } = props;

//   return (
//     <div
//       data-slot="field-separator"
//       data-content={!!children}
//       className={classNames(styles.fieldSeparator, className)}
//       {...rest}
//     >
//       <Separator className={styles.fieldSeparatorLine} />
//       {children && (
//         <span className={styles.fieldSeparatorContent} data-slot="field-separator-content">
//           {children}
//         </span>
//       )}
//     </div>
//   );
// }

type FieldErrorProps = React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
};

function FieldError(props: FieldErrorProps) {
  const { className, children, errors, ...rest } = props;

  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    if (errors?.length === 1) {
      return errors[0]?.message;
    }

    return (
      <ul className={styles.fieldErrorList}>
        {errors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div role="alert" data-slot="field-error" className={clsx(styles.fieldError, className)} {...rest}>
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  // FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
