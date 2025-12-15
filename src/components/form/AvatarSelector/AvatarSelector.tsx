import { Content, Root, Trigger } from '@radix-ui/react-collapsible';
import { Button } from '../../button/Button';
import { useState } from 'react';
import styles from './AvatarSelector.module.css';
import { UserAvatar } from '../../UserAvatar';
import { Icon } from '../../icon/Icon';

const AvatarButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Root>
      <Trigger className={styles.Button}>
        <UserAvatar avatarId="" />
        <Icon icon={isOpen ? 'chevron-up' : 'chevron-down'} />
      </Trigger>
      <Content>
        <div>
          <h1>SomeContent</h1>
        </div>
      </Content>
    </Root>
  );
};

export const AvatarSelector = () => {
  return (
    <div className={styles.Container}>
      <AvatarButton />
    </div>
  );
};
