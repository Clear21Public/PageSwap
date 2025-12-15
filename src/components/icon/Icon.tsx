import { ReactSVG } from 'react-svg';

import type { Props as RSProps } from 'react-svg';
import cn from 'classnames';

import styles from './Icon.module.css';

export interface Props extends Omit<RSProps, 'src'> {
  icon: 'plus' | 'trash-can' | 'check';
  type?: 'danger';
}

export const Icon = ({ className, icon, type }: Props) => {
  return <ReactSVG className={cn(className, { [styles.danger]: type === 'danger' })} src={`./icons/${icon}.svg`} />;
};
