import { useState, useEffect } from 'react';
import * as AvatarBase from '@radix-ui/react-avatar';
import styles from './Avatar.module.css';
import { useImageRepository } from '../repositories';

interface AvatarProps {
  imageFileName: string;
  description: string;
  size?: number;
  fallback: string;
}

export function Avatar({ imageFileName, description, size = 40 }: AvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const imageRepository = useImageRepository();

  useEffect(() => {
    let cancelled = false;

    const loadImage = async () => {
      try {
        const url = await imageRepository.get(imageFileName);
        if (!cancelled) {
          setImageUrl(url);
        }
      } catch {
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
  }, [imageFileName, imageRepository]);

  return (
    <AvatarBase.Root
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
          <AvatarBase.Image src={imageUrl || undefined} alt={description} className={styles.image} />
          <AvatarBase.Fallback
            className={styles.fallback}
            style={{
              fontSize: size * 0.4,
            }}
            delayMs={600}
          >
            {description}
          </AvatarBase.Fallback>
        </>
      )}
    </AvatarBase.Root>
  );
}
