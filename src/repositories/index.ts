// Public API for the repositories package
// This is the only file that should be imported by consumers

export { RepositoryProvider } from './RepositoryContext';

// Context hooks for accessing repositories
export { useUserRepository, useImageRepository, useDevUtilities } from './hooks';

// Repository interfaces (for type annotations)
export type { IUserRepository, IImageRepository } from './types';

// Avatar data and types
export { AVATAR_IDS, type AvatarId } from './avatars';

// Error types
export { ValidationError } from '../errors';
