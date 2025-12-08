import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type ButtonVariant = 'primary' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'medium' | 'large';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ButtonBaseProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface LinkButtonBaseProps extends React.ComponentProps<'a'> {
  asChild?: boolean;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface CommonButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconDefinition;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ButtonProps extends ButtonBaseProps, CommonButtonProps {
  isLoading?: boolean;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface LinkButtonProps extends LinkButtonBaseProps, CommonButtonProps {}
