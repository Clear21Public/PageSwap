import { useState, useEffect } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import styles from './UserAvatar.module.css';
import { useImageRepository } from '../repositories';

interface UserAvatarProps {
  avatarId: string;
  firstName?: string;
  lastName?: string;
  size?: number;
}

export function UserAvatar({ avatarId, firstName, lastName, size = 40 }: UserAvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const imageRepository = useImageRepository();

  useEffect(() => {
    let cancelled = false;

    const loadImage = async () => {
      try {
        const url = await imageRepository.get(`${avatarId}.jpg`);
        if (!cancelled) {
          setImageUrl(url);
        }
      } catch (err) {
        const fallbackUrl = await imageRepository.get('placeholder-dp.png');
        if (!cancelled) {
          setImageUrl(fallbackUrl);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [avatarId]);

  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((name) => name?.[0]?.toUpperCase())
      .join('')
      .slice(0, 2) || '?';

  return (
    <Avatar.Root
      className={`${styles.root} ${loading ? styles.loading : ''}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {loading ? (
        <div className={styles.loadingText}>...</div>
      ) : (
        <>
          <Avatar.Image
            src={imageUrl || undefined}
            alt={`${firstName || ''} ${lastName || ''}`.trim() || 'User'}
            className={styles.image}
          />
          <Avatar.Fallback
            className={styles.fallback}
            style={{
              fontSize: size * 0.4,
            }}
            delayMs={600}
          >
            {initials}
          </Avatar.Fallback>
        </>
      )}
    </Avatar.Root>
  );
}
