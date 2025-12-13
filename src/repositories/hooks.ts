import { createContext, useContext } from "react";
import type { IImageRepository, IUserRepository } from './types';
import type { DevUtilities, RepositoryContextValue } from "./RepositoryContext";

export const RepositoryContext = createContext<RepositoryContextValue | null>(null);
export const DevUtilitiesContext = createContext<DevUtilities | null>(null);

export function useUserRepository(): IUserRepository {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useUserRepository must be used within a RepositoryProvider');
  }
  return context.userRepository;
}

export function useImageRepository(): IImageRepository {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useImageRepository must be used within a RepositoryProvider');
  }
  return context.imageRepository;
}

export function useDevUtilities(): DevUtilities {
  const context = useContext(DevUtilitiesContext);
  if (!context) {
    throw new Error('useDevUtilities must be used within a RepositoryProvider');
  }
  return context;
}