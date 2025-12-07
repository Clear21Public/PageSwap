import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import styles from './Label.module.css';
import { clsx } from 'clsx';

function Label(props: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { className, ...childProps } = props;
  return <LabelPrimitive.Root data-slot="label" className={clsx(styles.label, className)} {...childProps} />;
}

export { Label };
