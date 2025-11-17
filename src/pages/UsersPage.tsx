import { useState } from 'react';
import { useQuery, useMutation, useQueryContext } from 'reactish-query';
import { faker } from '@faker-js/faker';
import { PlusIcon } from '@radix-ui/react-icons';
import { QueryKeys } from '../constants';
import { toast$ } from '../store';
import { UserRepository } from '../data/UserRepository';
import type { IUser } from '../types/IUser.ts';
import { AlertDialog, Dialog } from '../primitives';
import { UserTable } from '../components/UserTable';
import { UserForm, type UserFormData } from '../components/UserForm';
import base from '../styles/base.module.css';
import styles from './UsersPage.module.css';

export function UsersPage() {
  const [openForm, setOpenForm] = useState(false);
  const [deletingUser, setDeletingUser] = useState<IUser>();
  const { client: queryClient } = useQueryContext();
  const {
    data: users,
    isPending: loading,
    error
  } = useQuery({ queryKey: QueryKeys.users, queryFn: () => UserRepository.getAll() });

  const { trigger: createUser, isFetching: isCreatingUser } = useMutation<string, IUser>({
    queryFn: ({ args: user }) => UserRepository.add(user)
  });

  const { trigger: deleteUser, isFetching: isDeletingUser } = useMutation<void, IUser>({
    queryFn: ({ args: user }) => UserRepository.delete(user.id)
  });

  const handleCreateUser = async ({ avatar, ...otherData }: UserFormData) => {
    const user: IUser = {
      ...otherData,
      id: faker.string.uuid(),
      profileImageUrl: avatar?.id
    };
    const { error } = await createUser(user);
    if (!error) {
      setOpenForm(false);
      queryClient.setData<IUser[]>({ queryKey: QueryKeys.users }, (data) => [
        ...data,
        user
      ]);
      queryClient.invalidate({ queryKey: QueryKeys.users });

      toast$.success(<div>User added: {getUserName(user)}</div>);
    } else {
      toast$.error(<div>Failed to add user: {getUserName(user)}</div>);
    }
  };

  const handleDeleteUser = async (user: IUser) => {
    const { error } = await deleteUser(user);
    if (!error) {
      setDeletingUser(undefined);
      queryClient.setData<IUser[]>({ queryKey: QueryKeys.users }, (data) =>
        data.filter(({ id }) => user.id !== id)
      );
      queryClient.invalidate({ queryKey: QueryKeys.users });

      toast$.success(<div>User deleted: {getUserName(user)}</div>);
    } else {
      toast$.error(<div>Failed to delete user: {getUserName(user)}</div>);
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>User Management</h1>
        <p className={styles.errorText}>Error: {error.message}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.loadingTitle}>User Management</h1>
        <p className={styles.loadingText}>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <i className={`fa-solid fa-gear ${styles.userIcon}`}></i>
        <div className={styles.title}>User Management</div>
        <div className={styles.addUser}>
          <button className={base.btnSuccess} onClick={() => setOpenForm(true)}>
            <PlusIcon /> Add User
          </button>
        </div>
        <Dialog open={openForm} onOpenChange={setOpenForm} title="Add User to System">
          <UserForm
            isCreatingUser={isCreatingUser}
            onCancel={() => setOpenForm(false)}
            onSubmit={handleCreateUser}
          />
        </Dialog>
      </div>

      <div className={styles.tableWrapper}>
        <UserTable users={users} onRemove={setDeletingUser} />
      </div>

      <AlertDialog
        open={!!deletingUser}
        onClose={() => setDeletingUser(undefined)}
        onConfirm={() => handleDeleteUser(deletingUser!)}
        isPending={isDeletingUser}
        title="Remove User"
      >
        Are you sure you want to remove {getUserName(deletingUser)}?
        {isDeletingUser && ' (Removing user...)'}
      </AlertDialog>
    </div>
  );
}

function getUserName(user: IUser | undefined) {
  return (
    user && (
      <strong>
        {user.firstName} {user.lastName}
      </strong>
    )
  );
}
