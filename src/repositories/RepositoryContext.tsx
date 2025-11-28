import { useEffect, useState, type ReactNode } from 'react';
import { IndexDbUserRepository } from './IndexDbUserRepository';
import { StaticAssetImageRepository } from './StaticAssetImageRepository';
import type { IUser } from '../types/IUser';
import { RepositoryContext, DevUtilitiesContext, type DevUtilities } from './repositoryHooks';

interface RepositoryProviderProps {
  children: ReactNode;
}

export function RepositoryProvider({ children }: RepositoryProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [userRepository] = useState(() => new IndexDbUserRepository());
  const [imageRepository] = useState(() => new StaticAssetImageRepository());

  useEffect(() => {
    const initialize = async () => {
      try {
        await userRepository.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize repositories:', error);
      }
    };

    initialize();
  }, [userRepository]);

  const devUtilities: DevUtilities = {
    clearUsers: async () => {
      await userRepository.clear();
    },
    seedUsers: async (users: IUser[]) => {
      await userRepository.seed(users);
    },
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <RepositoryContext.Provider value={{ userRepository, imageRepository }}>
      <DevUtilitiesContext.Provider value={devUtilities}>{children}</DevUtilitiesContext.Provider>
    </RepositoryContext.Provider>
  );
}
