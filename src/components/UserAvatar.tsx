import { Avatar } from './Avatar';

interface UserAvatarProps {
  imageFileName: string;
  firstName?: string;
  lastName?: string;
  size?: number;
}

export function UserAvatar({ imageFileName, firstName, lastName, size = 40 }: UserAvatarProps) {
  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((name) => name?.[0]?.toUpperCase())
      .join('')
      .slice(0, 2) || '?';

  return (
    <Avatar
      imageFileName={imageFileName}
      description={`${firstName || ''} ${lastName || ''}`.trim() || 'User'}
      fallback={initials}
      size={size}
    />
  );
}
