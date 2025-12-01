import * as React from 'react';
import { AVATAR_IDS, useImageRepository } from '../../repositories';
import styles from './SelectAvatarMenu.module.css';

interface SelectAvatarMenuProps {
  handleSelectAvatar: (imageUrl: string) => void;
}

export const SelectAvatarMenu = ({ handleSelectAvatar }: SelectAvatarMenuProps) => {
  const imageRepository = useImageRepository();
  const [imageUrls, setImageUrls] = React.useState([] as string[]);

  // TODO: can this be cached to prevent fetching everytime user opens select
  React.useEffect(() => {
    Promise.all(AVATAR_IDS.map((id) => imageRepository.get(`${id}.jpg`))).then((result) => {
      setImageUrls(result);
    });
  }, [imageRepository]);

  return (
    <div className={styles.Content}>
      {/* TODO: add separator */}
      <div className={styles.AvatarSelectContainer}>
        <label className={styles.AvatarSelectLabel}>Available Avatars</label>
        <div className={styles.AvatarGridContainer}>
          {/* TODO: add loading state, try using Promise.allSettled() */}
          {imageUrls.map((url) => (
            <button key={url} className={styles.AvatarGridItem} onClick={() => handleSelectAvatar(url)}>
              <img className={styles.AvatarImage} src={url} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
