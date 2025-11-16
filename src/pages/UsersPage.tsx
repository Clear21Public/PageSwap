import { useState, useEffect, useCallback } from 'react'
import { UserRepository } from '../data/UserRepository'
import type { IUser } from '../types/IUser.ts'
import { UserTable } from '../components/UserTable'
import { AddUserDialog } from '../components/AddUserDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import styles from './UsersPage.module.css'

export function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null)

  const loadUsers = useCallback(async () => {
    try {
      const allUsers = await UserRepository.getAll()
      setUsers(allUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed get users.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const getUsers = async () => {
      await loadUsers()
    }

    getUsers()
  }, [loadUsers])

  const handleAddUser = useCallback(() => {
    setSuccessMessage(null)
    setIsAddDialogOpen(true)
  }, [])

  const handleUserCreated = useCallback(async () => {
    await loadUsers()
    setSuccessMessage('User created successfully.')
  }, [loadUsers])

  const handleRequestDeleteUser = useCallback((user: IUser) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleDeleteConfirmed = useCallback(async () => {
    if (!userToDelete) {
      return
    }

    await UserRepository.delete(userToDelete.id)
    await loadUsers()
    setSuccessMessage(`User deleted successfully.`)
    setUserToDelete(null)
  }, [userToDelete, loadUsers])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.loadingTitle}>User Management</h1>
        <p className={styles.loadingText}>Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>User Management</h1>
        <p className={styles.errorText}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <i className={`fa-solid fa-gear ${styles.userIcon}`}></i>
        <div className={styles.title}>User Management</div>
        <div className={styles.addUser}>
          <button className={styles.addUserButton} onClick={handleAddUser}>
            + Add User
          </button>
        </div>
      </div>

      {successMessage && (
        <div className={styles.successBanner}>
          <span>{successMessage}</span>
          <button
            type="button"
            className={styles.successDismiss}
            onClick={() => setSuccessMessage(null)}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <UserTable users={users} onRequestDelete={handleRequestDeleteUser} />
      </div>

      <AddUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onUserCreated={handleUserCreated}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)
          if (!open && !successMessage) {
            setUserToDelete(null)
          }
        }}
        title="Remove User"
        description={`Are you sure you want to remove ${
          `${userToDelete?.firstName || ''} ${userToDelete?.lastName || ''}`.trim() || 'this user'
        }?`}
        confirmLabel="Yes"
        cancelLabel="Cancel"
        onConfirm={async () => {
          try {
            await handleDeleteConfirmed()
          } catch (err) {
            if (err instanceof Error) {
              throw err
            }
            throw new Error('Failed to delete user. Please try again.')
          }
        }}
      />
    </div>
  )
}
