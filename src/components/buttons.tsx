import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import styles from './buttons.module.css';
import { clsx } from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import type { ButtonBaseProps, ButtonProps } from './buttons.types';
import { commonButtonClassNames } from './buttons.utils';

export function ButtonBase(props: ButtonBaseProps) {
  const { asChild = false, ...childProps } = props;
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" {...childProps} />;
}

export function Button(props: ButtonProps) {
  const {
    className,
    variant = 'primary',
    size = 'medium',
    children,
    isLoading = false,
    icon,
    ...buttonBaseProps
  } = props;

  const iconDefinition = isLoading ? faCircleNotch : icon;

  return (
    <ButtonBase
      className={clsx(className, commonButtonClassNames(variant, size), {
        [styles.loading]: isLoading,
      })}
      {...buttonBaseProps}
    >
      {iconDefinition && <FontAwesomeIcon icon={iconDefinition} spin={isLoading} />}
      {children}
    </ButtonBase>
  );
}
