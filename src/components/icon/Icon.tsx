import { ReactSVG } from 'react-svg';

import type { Props as RSProps } from 'react-svg';
import cn from 'classnames';

import styles from './Icon.module.css';

type IconName = 'plus' | 'trash-can' | 'check' | 'chevron-down' | 'chevron-up';

export interface Props extends Omit<RSProps, 'src'> {
  icon: IconName;
  type?: 'danger';
}

export const Icon = ({ className, icon, type }: Props) => {
  return <ReactSVG className={cn(className, { [styles.danger]: type === 'danger' })} src={`./icons/${icon}.svg`} />;
};
