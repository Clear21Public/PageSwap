import { clsx } from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import styles from './typography.module.css';
import type React from 'react';

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextElement = 'div' | 'p';
type SmallTextElement = 'span' | 'small';

export type TextProps<T extends keyof React.JSX.IntrinsicElements & keyof HTMLElementTagNameMap> =
  React.ComponentProps<T> & {
    /** Ref object for the underlying HTML element */
    ref?: React.Ref<HTMLElementTagNameMap[T]> | undefined;
    /** The HTML element type to render */
    as?: T;
    /** Whether to render as a child component using Slot */
    asChild?: boolean;
  };

export type HeadingProps<T extends keyof React.JSX.IntrinsicElements & keyof HTMLElementTagNameMap> = TextProps<T> & {
  /** Visual variant of the component */
  variant?: 'primary' | 'secondary' | 'tertiary';
};

function getHeadingVariantClassName<T extends HeadingElement>(variant: HeadingProps<T>['variant']) {
  return clsx({
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.tertiary]: variant === 'tertiary',
  });
}

/**
 * Main heading component for primary page titles and major sections.
 * @param props.as - The HTML element type to render (defaults to "h2")
 * @param props.asChild - Whether to render as a child component using Slot
 * @param props.className - Additional CSS classes to apply
 */
export function MainHeading<T extends HeadingElement>(props: HeadingProps<T>) {
  const { as = 'h2', asChild, className, variant = 'primary', ...childProps } = props;
  const Comp = asChild ? Slot : as;
  return <Comp className={clsx(styles.mainHeading, getHeadingVariantClassName(variant), className)} {...childProps} />;
}

/**
 * Modal heading component specifically designed for modal dialog titles.
 * @param props.as - The HTML element type to render (defaults to "h3")
 * @param props.asChild - Whether to render as a child component using Slot
 * @param props.className - Additional CSS classes to apply
 */
export function ModalHeading<T extends HeadingElement>(props: HeadingProps<T>) {
  const { as = 'h3', asChild, className, variant = 'primary', ...childProps } = props;
  const Comp = asChild ? Slot : as;
  return <Comp className={clsx(styles.modalHeading, getHeadingVariantClassName(variant), className)} {...childProps} />;
}

/**
 * Medium-sized heading component for section titles and subsections.
 * @param props.as - The HTML element type to render (defaults to "h3")
 * @param props.asChild - Whether to render as a child component using Slot
 * @param props.className - Additional CSS classes to apply
 * @param props.variant - Visual variant of the component (defaults to "default")
 */
export function MediumHeading<T extends HeadingElement>(props: HeadingProps<T>) {
  const { as = 'h3', asChild, className, variant = 'primary', ...childProps } = props;
  const Comp = asChild ? Slot : as;
  return (
    <Comp className={clsx(styles.mediumHeading, getHeadingVariantClassName(variant), className)} {...childProps} />
  );
}

/**
 * Small heading component for minor section titles and labels.
 * @param props.as - The HTML element type to render (defaults to "h6")
 * @param props.asChild - Whether to render as a child component using Slot
 * @param props.className - Additional CSS classes to apply
 * @param props.variant - Visual variant of the component (defaults to "default")
 */
export function SmallHeading<T extends HeadingElement>(props: HeadingProps<T>) {
  const { as = 'h6', asChild, className, variant = 'primary', ...childProps } = props;
  const Comp = asChild ? Slot : as;
  return <Comp className={clsx(styles.smallHeading, getHeadingVariantClassName(variant), className)} {...childProps} />;
}

/**
 * Body text component for regular paragraph content and text blocks.
 * @param props.as - The HTML element type to render (defaults to "div")
 * @param props.asChild - Whether to render as a child component using Slot
 * @param props.className - Additional CSS classes to apply
 */
export function BodyText<T extends TextElement>(props: TextProps<T>) {
  const { as = 'div', asChild, className, ...childProps } = props;
  const Comp = asChild ? Slot : as;
  return <Comp className={clsx(styles.bodyText, className)} {...childProps} />;
}

/**
 * Small body text component for captions, footnotes, and secondary information.
 * @param props.as - The HTML element type to render (defaults to "small")
 * @param props.asChild - Whether to render as a child component using Slot
 * @param props.className - Additional CSS classes to apply
 * @param props.variant - Visual variant of the component (defaults to "default")
 */
export function SmallBodyText<T extends SmallTextElement>(props: HeadingProps<T>) {
  const { as = 'small', asChild, className, ...childProps } = props;
  const Comp = asChild ? Slot : as;
  return <Comp className={clsx(styles.smallBodyText, className)} {...childProps} />;
}
