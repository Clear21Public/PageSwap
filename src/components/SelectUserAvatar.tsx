import { useState, useEffect, useCallback } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import * as Collapsible from '@radix-ui/react-collapsible';
import styles from './SelectUserAvatar.module.css';
import { useImageRepository } from '../repositories';

const KNOWN_AVATAR_IDS = [
  '1d4040ea-9a2c-468d-83b4-de9a8f62ed86.jpg',
  '1f999ca4-3074-4535-a4cb-6b70734aa239.jpg',
  '20d61daa-8561-4be6-a565-773f28245e69.jpg',
  '2e5abe9d-ee2d-4103-b0f7-ebb2452e5cc2.jpg',
  '6bd19655-6f28-4f6d-9180-7c7ea2080b28.jpg',
  '6e682581-5425-49f9-bad6-8cf28fab5bd7.jpg',
  '8002ce24-1b80-459e-bdf2-1c934cffa931.jpg',
  'c74f6420-88e3-4ef0-a353-be23ec7fca26.jpg',
  'cabf6ef5-6411-4c25-ba86-14dbd77ffff3.jpg',
  'cb7f15e0-cb7b-475d-a953-0a4e69a7ea29.jpg',
  'ea9dc4cf-546f-41ff-8340-f99edf98a326.jpg',
];

const SELECTED_IMAGE_SIZE = 125;
const OPTION_IMAGE_SIZE = 60;

interface SelectUserAvatarProps {
  setAvatarId(id: string): void;

  currentSelectedAvatarId?: string;
}

interface AvatarDetails {
  avatarId: string;
  url: string;
}

export function SelectUserAvatar({ currentSelectedAvatarId, setAvatarId }: SelectUserAvatarProps) {
  const imageRepository = useImageRepository();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [avatarOptions, setAvatarOptions] = useState<AvatarDetails[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  // effect to load current selected avatar id if any
  useEffect(() => {
    const loadSelectedImage = async () => {
      setSelectedImageUrl(
        currentSelectedAvatarId
          ? await imageRepository.get(currentSelectedAvatarId)
          : await imageRepository.get('placeholder-dp.png')
      );
      setLoading(false);
    };

    loadSelectedImage();
  }, [currentSelectedAvatarId, imageRepository]);

  // effect to load all known avatar options
  useEffect(() => {
    setLoadingOptions(true);

    let cancelled = false;
    let imageLoaded = 0;

    const loadImages = async () => {
      try {
        for (const avatarId of KNOWN_AVATAR_IDS) {
          // load image as fast as possible
          setTimeout(async () => {
            const url = await imageRepository.get(avatarId);
            if (!cancelled) {
              setAvatarOptions((prevOpts) => [...prevOpts, { avatarId, url }]);

              imageLoaded++;
              // console.log('image loaded', imageLoaded);
              // we still "loading" if all images have not been loaded yet
              setLoadingOptions(imageLoaded !== KNOWN_AVATAR_IDS.length);
            } else {
              setLoadingOptions(false);
            }
          }, 0);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [imageRepository]);

  const selectAvatar = useCallback(
    (opt: AvatarDetails) => {
      // console.log('selected avatar', opt);
      setSelectedImageUrl(opt.url);
      setAvatarId(opt.avatarId);
      setExpanded(false);
    },
    [setAvatarId]
  );

  return (
    <div className={`${styles.selectUserAvatar}`}>
      <Avatar.Root
        className={`${styles.selectedAvatar} ${loading ? styles.loading : ''}`}
        style={{
          width: SELECTED_IMAGE_SIZE,
          height: SELECTED_IMAGE_SIZE,
        }}
      >
        {loading ? (
          <span className={styles.loader}></span>
        ) : (
          <>
            <Avatar.Image src={selectedImageUrl} alt="Selected user avatar" className={styles.image} />
            <Avatar.Fallback
              className={styles.fallback}
              style={{
                fontSize: SELECTED_IMAGE_SIZE * 0.4,
              }}
              delayMs={600}
            ></Avatar.Fallback>
          </>
        )}
      </Avatar.Root>
      <Collapsible.Root className={`${styles.collapsibleAvatar}`} open={expanded} onOpenChange={setExpanded}>
        <Collapsible.Trigger className={`${styles.collapsibleTrigger}`}>
          Select {expanded ? <i className="fas fa-chevron-up" /> : <i className="fas fa-chevron-down" />}
        </Collapsible.Trigger>
        <Collapsible.Content className={`${styles.optionAvatarWrapper}`}>
          {avatarOptions.map((opt, index) => (
            <Avatar.Root
              key={opt.avatarId}
              className={`${styles.optionAvatar}`}
              style={{
                width: OPTION_IMAGE_SIZE,
                height: OPTION_IMAGE_SIZE,
              }}
            >
              <Avatar.Image
                src={opt.url}
                alt={`Predefined Avatar ${index}`}
                className={styles.image}
                onClick={() => selectAvatar(opt)}
              />
            </Avatar.Root>
          ))}
          {loadingOptions && <span className={styles.loader}>...</span>}
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
