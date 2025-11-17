import { clsx } from 'clsx';
import { useState, useId } from 'react';
import { useQuery } from 'reactish-query';
import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import placeholder from '../assets/placeholder-dp.png';
import { QueryKeys } from '../constants';
import { AVATAR_IDS } from '../data/avatars';
import { ImageRepository } from '../data/ImageRepository';
import base from '../styles/base.module.css';
import styles from './AvatarPicker.module.css';

interface Avatar {
  id: string;
  url: string;
}

interface AvatarPickerProps {
  value?: Avatar;
  onChange?: (avatar: Avatar) => void;
}

const AvatarPicker = ({ value, onChange }: AvatarPickerProps) => {
  const [showAvatars, setShowAvatars] = useState(false);
  const id = useId();
  const avatarGridId = `${id}-grid`;
  const avatarViewId = `${id}-view`;

  const { data: avatars, isPending } = useQuery<Avatar[]>({
    queryKey: QueryKeys.avatars,
    queryFn: () =>
      Promise.all(
        AVATAR_IDS.map(async (id) => ({ id, url: await ImageRepository.get(id) }))
      ),
    staleTime: Infinity,
    cacheMode: 'persist'
  });

  const renderAvatarGrid = () => {
    if (isPending) return <p className={base.label}>Loading avatars...</p>;

    return (
      <div className={styles.avatars} id={avatarViewId}>
        <label htmlFor={avatarGridId} className={base.label}>
          Available Avatars
        </label>
        <div className={styles.avatarGrid} id={avatarGridId}>
          {avatars.map((avatar, index) => (
            <img
              className={clsx(styles.avatar, value?.id === avatar.id && styles.selected)}
              key={avatar.id}
              src={avatar.url}
              alt={`avatar-${index}`}
              onClick={() => onChange?.(avatar)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.userAvatarWrap}>
        <img
          className={styles.userAvatar}
          src={value?.url || placeholder}
          alt="user avatar"
        />
        <button
          className={styles.toggle}
          aria-expanded={showAvatars}
          aria-controls={avatarViewId}
          type="button"
          onClick={() => setShowAvatars((prev) => !prev)}
        >
          Select {showAvatars ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </div>
      {showAvatars && renderAvatarGrid()}
    </>
  );
};

export { AvatarPicker, type AvatarPickerProps };
