import { useCallback, useEffect, useState } from 'react';
import { useUserRepository } from '../repositories';
import type { IUser } from '../types/IUser.ts';
import { UserTable } from '../components/UserTable';
import styles from './UsersPage.module.css';
import { Button } from '../components/ui/button';
import { AddUserDialog, type AddUserFormState } from '../components/UserAddDialog.tsx';

export function UsersPage() {
  const userRepository = useUserRepository();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      const allUsers = await userRepository.getAll(0, Number.MAX_SAFE_INTEGER);
      setUsers(allUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed get users.');
    } finally {
      setLoading(false);
    }
  }, [userRepository]);

  useEffect(() => {
    const getUsers = async () => {
      await loadUsers();
    };

    getUsers();
  }, [loadUsers]);

  const handleAddUser = useCallback(
    async (userData: AddUserFormState) => {
      const user: IUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age && +userData.age,
        profileImageUrl: userData.avatarId ?? '',
        id: `user-${Math.ceil(Math.random() * 1000)}`,
      };
      try {
        await userRepository.add(user);
        await loadUsers();
        setSuccess(`Successfully added new user - ${userData.firstName} ${userData.lastName}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed add user.');
      }
    },
    [loadUsers, userRepository]
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.loadingTitle}>User Management</h1>
        <p className={styles.loadingText}>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.messageContainer}>
        <h1 className={styles.messageTitle}>User Management</h1>
        <p className={styles.errorText}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <i className={`fa-solid fa-gear ${styles.userIcon}`}></i>
        <div className={styles.title}>User Management</div>
        <div className={styles.addUser}>
          <AddUserDialog onCreate={handleAddUser} />
        </div>
      </div>
      <div className={styles.tableWrapper}>
        {success && (
          <div className={styles.messageContainer}>
            <p className={styles.successText}>
              {success}
              <Button asChild onClick={() => setSuccess(null)}>
                <i className={`fa-solid fa-close`}></i>
              </Button>
            </p>
          </div>
        )}
        <UserTable users={users} />
      </div>
    </div>
  );
}
