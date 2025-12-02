import { type AvatarImage } from '../add-user-dialog/AddUserDialog';
import styles from './SelectAvatarMenu.module.css';

interface SelectAvatarMenuProps {
  handleSelectAvatar: (imageUrl: AvatarImage) => void;
  avatarImages: AvatarImage[];
}

export const SelectAvatarMenu = ({ handleSelectAvatar, avatarImages }: SelectAvatarMenuProps) => {
  return (
    <div className={styles.Content}>
      <div className={styles.AvatarSelectContainer}>
        <label className={styles.AvatarSelectLabel}>Available Avatars</label>
        <div className={styles.AvatarGridContainer}>
          {/* TODO: add loading state, try using Promise.allSettled() */}
          {avatarImages.map((image) => (
            <button key={image.id} className={styles.AvatarGridItem} onClick={() => handleSelectAvatar(image)}>
              <img className={styles.AvatarImage} src={image.url} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
