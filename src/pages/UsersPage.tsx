import { useState, useEffect, useCallback } from 'react';
import { useUserRepository, ValidationError } from '../repositories';
import type { IUser } from '../types/IUser.ts';
import { UserTable } from '../components/UserTable';
import styles from './UsersPage.module.css';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogScroller,
  DialogTitle,
  DialogTrigger,
} from '../components/Dialog.tsx';
import { Button } from '../components/buttons.tsx';
import { TextFormField } from '../components/TextFormField.tsx';
import { useForm } from 'react-hook-form';
import { FieldGroup } from '../components/Field.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';

type TFormUser = Omit<IUser, 'age'> & {
  age: string;
};

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function UsersPage() {
  const userRepository = useUserRepository();

  const {
    isLoading,
    error,
    data: users = [],
    refetch,
  } = useQuery({
    queryKey: [userRepository.getAll, 0, Number.MAX_SAFE_INTEGER],
    queryFn: async () => await userRepository.getAll(0, Number.MAX_SAFE_INTEGER),
  });

  const form = useForm<TFormUser>({
    // Not adding client-side validation due to time constraints
    //  resolver: zodResolver,
    defaultValues: {
      firstName: '',
      lastName: '',
      age: '',
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
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
        <p className={styles.errorText}>Error: {error?.message}</p>
      </div>
    );
  }

  async function onSubmit(data: TFormUser) {
    const { age } = data;

    await delay(1000);

    try {
      console.log('adding');
      await userRepository.add({
        ...data,
        id: crypto.randomUUID(),
        // TODO: Add avater selector section
        profileImageUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
        age: age ? Number(data.age) : undefined,
      });
      setIsDialogOpen(false);
      refetch();
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        error.propertyErrors.forEach((e) => {
          form.setError(e.property as keyof TFormUser, {
            message: e.message,
          });
        });
      } else {
        throw error;
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <i className={`fa-solid fa-gear ${styles.userIcon}`}></i>
        <div className={styles.title}>User Management</div>
        <div className={styles.addUser}>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="success">+ Add User</Button>
            </DialogTrigger>
            {/* Should really add the Visually Hidden component and wrap it around a semantic DialogDescription https://www.radix-ui.com/primitives/docs/components/dialog#description */}
            <DialogContent aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle>Add User to System</DialogTitle>
              </DialogHeader>
              <DialogScroller>
                {/* TODO: Should live on the field group. */}
                <FieldGroup style={{ gap: 8 }}>
                  <TextFormField
                    disabled={form.formState.isSubmitting}
                    label="First Name"
                    required
                    control={form.control}
                    name="firstName"
                  />
                  <TextFormField
                    disabled={form.formState.isSubmitting}
                    label="Last Name"
                    required
                    control={form.control}
                    name="lastName"
                  />
                  <TextFormField disabled={form.formState.isSubmitting} label="Age" control={form.control} name="age" />
                </FieldGroup>
              </DialogScroller>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogTrigger>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Button variant="success" type="submit" disabled={form.formState.isSubmitting}>
                    <FontAwesomeIcon icon={faCheck} /> Create
                  </Button>
                </form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <UserTable users={users} />
      </div>
    </div>
  );
}
