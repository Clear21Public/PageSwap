import { useState, useEffect, useCallback } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { useUserRepository } from '../repositories';
import type { IUser } from '../types/IUser.ts';
import { UserTable } from '../components/UserTable';
import { Button } from '../components/button/Button';
import { AddUserDialog } from '../components/add-user-dialog/AddUserDialog.tsx';
import styles from './UsersPage.module.css';

export function UsersPage() {
  const userRepository = useUserRepository();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  console.log({ users });

  useEffect(() => {
    const getUsers = async () => {
      await loadUsers();
    };

    getUsers();
  }, [loadUsers]);

  const handleOpenDialogChange = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, [setOpenDialog]);

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
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>User Management</h1>
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
          <Button className={styles.addUserButton} onClick={handleOpenDialogChange}>
            {/* TODO: fix plus icon size and weigth */}
            <PlusIcon strokeWidth="12px" />
            <p>Add User</p>
          </Button>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <UserTable users={users} />
      </div>
      <AddUserDialog open={openDialog} onOpenChange={handleOpenDialogChange} />
    </div>
  );
}
