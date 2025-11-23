/**
 * Avatar placeholder icon component
 * Displays a default user silhouette when no avatar is selected
 */

const AVATAR_PLACEHOLDER_SIZE = 80;

export function AvatarPlaceholderIcon() {
  return (
    <svg width={AVATAR_PLACEHOLDER_SIZE} height={AVATAR_PLACEHOLDER_SIZE} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        fill="currentColor"
      />
      <path
        d="M12 14C7.58172 14 4 15.7909 4 18V20H20V18C20 15.7909 16.4183 14 12 14Z"
        fill="currentColor"
      />
    </svg>
  );
}
