import style from './button.module.css';
import { Slot } from "@radix-ui/react-slot"

type Variants = {
  default: string;
  error: string;
  success: string;
};

type ButtonProps = {
  variant?: keyof Variants;
  asChild?: boolean
};

const variants: Variants = {
  default: style.btnDefault,
  error: style.btnError,
  success: style.btnSuccess,
};

export function Button({ className, asChild, variant = 'default', ...props }: React.ComponentProps<'button'> & ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const classes = asChild ? ' ' : `${variants[variant]} ${className ?? ''}`
  return <Comp data-slot="button" className={classes} {...props} />;
}
