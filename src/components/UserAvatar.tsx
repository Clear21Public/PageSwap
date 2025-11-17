import { useQuery } from 'reactish-query';
import * as Avatar from '@radix-ui/react-avatar';
import { QueryKeys } from '../constants';
import { ImageRepository } from '../data/ImageRepository';
import styles from './UserAvatar.module.css';

interface UserAvatarProps {
  avatarId: string;
  firstName?: string;
  lastName?: string;
  size?: number;
}

export function UserAvatar({
  avatarId,
  firstName,
  lastName,
  size = 40
}: UserAvatarProps) {
  const { data: imageUrl, isPending: loading } = useQuery({
    queryKey: [QueryKeys.avatar, avatarId],
    queryFn: () => avatarId && ImageRepository.get(avatarId),
    staleTime: Infinity
  });

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
        height: size
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
              fontSize: size * 0.4
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
