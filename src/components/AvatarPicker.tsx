import { clsx } from 'clsx';
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
  const { data: avatars, isPending } = useQuery<Avatar[]>({
    queryKey: 'avatars',
    queryFn: () =>
      Promise.all(
        AVATAR_IDS.map(async (id) => ({ id, url: await ImageRepository.get(id) }))
      ),
    staleTime: Infinity,
    cacheMode: 'persist'
  });

  const avatarGrid = isPending ? (
    <p>Loading avatars...</p>
  ) : (
    <div className={styles.avatarGrid}>
      {avatars?.map((avatar) => (
        <img
          className={clsx(styles.avatar, value?.id === avatar.id && styles.selected)}
          src={avatar.url}
          alt="avatar"
          onClick={() => onChange?.(avatar)}
        />
      ))}
    </div>
  );

  return (
    <div>
      <img
        className={styles.userAvatar}
        src={value?.url || placeholder}
        alt="user avatar"
      />
      {avatarGrid}
    </div>
  );
};

export { AvatarPicker, type AvatarPickerProps };
