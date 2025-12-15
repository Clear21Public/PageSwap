import { Content, Root, Trigger } from '@radix-ui/react-collapsible';
import { useState } from 'react';
import styles from './AvatarSelector.module.css';
import { UserAvatar } from '../../UserAvatar';

const AvatarButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Root>
      <Trigger onClick={() => setIsOpen(!isOpen)} className={styles.Button}>
        <UserAvatar avatarId="" />
        {isOpen ? <i className="fa-solid fa-chevron-up" /> : <i className="fa-solid fa-chevron-down" />}
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
