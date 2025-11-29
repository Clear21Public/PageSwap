import style from './input.module.css'

export function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return <input type={type} className={`${style.Input} ${className ?? ''}`} {...props} />;
}
