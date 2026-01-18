import * as Form from '@radix-ui/react-form';
import * as Separator from '@radix-ui/react-separator';
import { useState } from 'react';
import { UserAvatar } from './UserAvatar.tsx';
import { AVATAR_IDS } from '../repositories/index.ts';
import styles from './Button.module.css';

interface AvatarSelectorProps {
  selectedAvatar: string;
  setSelectedAvatar: (avatar: string) => void;
}

export const AvatarSelector = ({ selectedAvatar, setSelectedAvatar }: AvatarSelectorProps) => {
  const [showGrid, setShowGrid] = useState(false);
  const arrowIcon = showGrid ? 'fa-angle-up' : 'fa-angle-down';
  return (
    <div>
      <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
        <UserAvatar avatarId={selectedAvatar} />
        <button onClick={() => setShowGrid(!showGrid)}>
          Select
          <i className={`fa-solid ${arrowIcon}`} />
        </button>
      </div>
      {showGrid && <AvatarGrid setShowGrid={setShowGrid} setSelectedAvatar={setSelectedAvatar}></AvatarGrid>}
    </div>
  );
};

interface AvatarGridProps {
  setSelectedAvatar: (avatar: string) => void;
  setShowGrid: (showGrid: boolean) => void;
}

export const AvatarGrid = ({ setSelectedAvatar, setShowGrid }: AvatarGridProps) => {
  return (
    <Form.FormField name="avatar-selector">
      <Separator.Root className={styles.Separator} />
      <Form.Label className={styles.Label}>Available avatars</Form.Label>
      <div>
        {AVATAR_IDS.map((avatar) => (
          <SelectableAvatar
            key={avatar}
            avatar={avatar}
            setSelectedAvatar={setSelectedAvatar}
            setShowGrid={setShowGrid}
          />
        ))}
      </div>
    </Form.FormField>
  );
};

interface SelectableAvatarProps {
  avatar: string;
  setSelectedAvatar: (avatar: string) => void;
  setShowGrid: (showGrid: boolean) => void;
}

export const SelectableAvatar = ({ avatar, setSelectedAvatar, setShowGrid }: SelectableAvatarProps) => {
  const avatarFilename = avatar + '.jpg';
  return (
    <span
      onClick={() => {
        setSelectedAvatar(avatarFilename);
        setShowGrid(false);
      }}
    >
      <UserAvatar avatarId={avatarFilename} />
    </span>
  );
};
