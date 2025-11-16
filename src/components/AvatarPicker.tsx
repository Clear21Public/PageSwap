import { clsx } from 'clsx';
import { useState } from 'react';
import { useQuery } from 'reactish-query';
import { AVATAR_IDS } from '../data/avatars';
import { ImageRepository } from '../data/ImageRepository';
import placeholder from '../assets/placeholder-dp.png';
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

  const { data: avatars, isPending } = useQuery<Avatar[]>({
    queryKey: 'avatars',
    queryFn: () =>
      Promise.all(
        AVATAR_IDS.map(async (id) => ({ id, url: await ImageRepository.get(id) }))
      ),
    staleTime: Infinity,
    cacheMode: 'persist'
  });

  const renderAvatarGrid = () => {
    if (isPending) return <p>Loading avatars...</p>;

    return (
      <div className={styles.avatarGrid}>
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
    );
  };

  return (
    <div>
      <img
        className={styles.userAvatar}
        src={value?.url || placeholder}
        alt="user avatar"
      />
      <button type="button" onClick={() => setShowAvatars((s) => !s)}>
        Select
      </button>
      {showAvatars && renderAvatarGrid()}
    </div>
  );
};

export { AvatarPicker, type AvatarPickerProps };
