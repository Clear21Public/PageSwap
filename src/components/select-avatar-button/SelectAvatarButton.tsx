import * as React from "react"
import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import styles from './SelectAvatarButton.module.css';

type SelectAvatarButtonProps = {
   open: boolean
} & React.HtmlHTMLAttributes<HTMLButtonElement>

export const SelectAvatarButton = ({ open, ...props }: SelectAvatarButtonProps) => {
  return (
      <button className={styles.Button} {...props}>
        <span>Select</span>
        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
  );
};
