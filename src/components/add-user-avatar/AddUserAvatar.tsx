import * as Avatar from '@radix-ui/react-avatar';
import styles from './AddUserAvatar.module.css';

interface UserAvatarProps {
  avatarImageUrl?: string;
}

export const AddUserAvatar = ({ avatarImageUrl }: UserAvatarProps) => {
  return (
    <Avatar.Root className={styles.Root}>
      <Avatar.Image className={styles.Image} src={avatarImageUrl} />
      <Avatar.Fallback className={styles.Fallback} asChild>
        <img src="public/assets/placeholder-dp.png" />
      </Avatar.Fallback>
    </Avatar.Root>
  );
};
