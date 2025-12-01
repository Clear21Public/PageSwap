import * as Avatar from '@radix-ui/react-avatar';
import styles from './AddUserAvatar.module.css';

interface UserAvatarProps {
  imageUrl: string;
}

export const AddUserAvatar = ({ imageUrl }: UserAvatarProps) => {
  return (
    <Avatar.Root className={styles.Root}>
      <Avatar.Image className={styles.Image} src={imageUrl} />
      <Avatar.Fallback className={styles.Fallback} asChild>
        <img src="public/assets/placeholder-dp.png" />
      </Avatar.Fallback>
    </Avatar.Root>
  );
};
