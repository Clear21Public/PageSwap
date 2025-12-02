import * as React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import styles from './AddUserAvatar.module.css';
import { useImageRepository } from '../../repositories';

interface UserAvatarProps {
  avatarId: string;
}

export const AddUserAvatar = ({ avatarId }: UserAvatarProps) => {
  const [imageUrl, setImageUrl] = React.useState('');
  const imageRepository = useImageRepository();

  React.useEffect(() => {
    const fetch = async () => {
      if (avatarId) {
        const url = await imageRepository.get(avatarId);
        setImageUrl(url);
      }
    };
    fetch();
  }, [avatarId, imageRepository]);

  return (
    <Avatar.Root className={styles.Root}>
      <Avatar.Image className={styles.Image} src={imageUrl} />
      <Avatar.Fallback className={styles.Fallback} asChild>
        <img src="public/assets/placeholder-dp.png" />
      </Avatar.Fallback>
    </Avatar.Root>
  );
};
