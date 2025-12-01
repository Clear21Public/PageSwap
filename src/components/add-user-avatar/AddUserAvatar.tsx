import * as React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { useImageRepository } from '../../repositories';
import styles from './AddUserAvatar.module.css';

type UserAvatarProps = {
  imageId: string;
};

export const AddUserAvatar = ({ imageId }: UserAvatarProps) => {
  const [url, setUrl] = React.useState('');
  const imageRepository = useImageRepository();

  React.useEffect(() => {
    const fetch = async () => {
      const imageUrl = await imageRepository.get(imageId);
      console.log({ imageUrl });
      setUrl(imageUrl);
    };
    fetch();
  }, [imageRepository, imageId]);

  imageRepository.get(imageId).then((data) => data).then((res) => console.log(res));

  console.log({ url, imageId });

  return (
    <Avatar.Root className={styles.Root}>
      <Avatar.Image className={styles.Image} src={url} />
      <Avatar.Fallback className={styles.Fallback} asChild>
        <img src="public/assets/placeholder-dp.png" />
      </Avatar.Fallback>
    </Avatar.Root>
  );
};
