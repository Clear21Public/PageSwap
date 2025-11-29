import { useState } from 'react';
import * as React from 'react';
import { AVATAR_IDS, type AvatarId } from '../repositories';
import { Button } from './ui/button.tsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog.tsx';
import styles from './UserAddDialog.module.css';
import { Input } from './ui/input.tsx';

export type AddUserFormState = {
  firstName: string;
  lastName: string;
  age?: number;
  avatarId?: AvatarId;
};

type AddUserDialogProps = {
  onCreate: (data: AddUserFormState) => Promise<void>;
};

export function AddUserDialog({ onCreate }: AddUserDialogProps) {
  const [formState, setFormState] = useState<AddUserFormState>({ firstName: '', lastName: '' });
  const [error, setError] = useState<string>('');
  const [openDialog, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showAvatars, setShowAvatars] = useState<boolean>(false);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof AddUserFormState) => {
    setFormState((prevState) => ({ ...prevState, [fieldName]: e.target.value }));
    if (!hasError()) {
      setError('');
    }
  };

  const handleAvatarSelect = (avatarId: AvatarId) => {
    setFormState((prevState) => ({ ...prevState, avatarId }));
  };

  const clearAvatar = () => {
    setFormState((prevState) => ({ ...prevState, avatarId: undefined }));
  };

  const hasError = () => {
    const fields = ['firstName', 'lastName'] as const;
    return fields.some((field) => !formState[field]);
  };

  const handleCreate = async () => {
    if (hasError()) {
      setError('This field is required');
      return;
    }
    setLoading(true);
    await onCreate(formState);
    setOpen(false);
    setFormState({ firstName: '', lastName: '' });
    setLoading(false);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} variant="success">
        + Add User
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User to System</DialogTitle>
          </DialogHeader>
          <div className={styles.addUserDialogContent}>
            {/*todo move to separate component*/}
            <div className={styles.selectAvatar}>
              <div className={styles.selectAvatarPreview}>
                <img
                  src={`/assets/${formState.avatarId ? `${formState.avatarId}.jpg` : 'placeholder-dp.png'}`}
                  alt=""
                />
                {formState.avatarId && (
                  <Button asChild onClick={() => clearAvatar()}>
                    <i className="fa-solid fa-trash-can" />
                  </Button>
                )}
              </div>
              <Button asChild onClick={() => setShowAvatars((prev) => !prev)}>
                <div className={styles.selectAvatarBtn}>
                  Select <i className={`fa-solid ${showAvatars ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                </div>
              </Button>
            </div>
            <div className={`${styles.avatarGridWrapper} ${showAvatars ? styles.expanded : styles.collapsed}`}>
              <label>Available avatars</label>
              <div className={styles.avatarGrid}>
                {AVATAR_IDS.map((id) => (
                  <Button asChild key={id} onClick={() => handleAvatarSelect(id)}>
                    <img className={styles.avatarImg} src={`/assets/${id}.jpg`} alt="" />
                  </Button>
                ))}
              </div>
            </div>
            <div
              className={`${styles.fieldContainer} ${error && !formState.firstName ? styles.fieldContainerError : ''}`}
            >
              <label htmlFor="firstName">
                First Name <span>*</span>
              </label>
              <Input
                onChange={(e) => handleFieldChange(e, 'firstName')}
                id="firstName"
                type="text"
                value={formState.firstName || ''}
              />
              {error && !formState.firstName && <span>{error}</span>}
            </div>
            <div
              className={`${styles.fieldContainer} ${error && !formState.lastName ? styles.fieldContainerError : ''}`}
            >
              <label htmlFor="lastName">
                Last Name <span>*</span>
              </label>
              <Input
                onChange={(e) => handleFieldChange(e, 'lastName')}
                id="lastName"
                type="text"
                value={formState.lastName || ''}
              />
              {error && !formState.lastName && <span>{error}</span>}
            </div>
            <div className={styles.fieldContainer}>
              <label htmlFor="age">Age</label>
              <Input onChange={(e) => handleFieldChange(e, 'age')} id="age" type="number" value={formState.age || ''} />
            </div>
          </div>
          <DialogFooter>
            <div className={styles.addUserDialogFooter}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button disabled={loading} variant="success" onClick={handleCreate}>
                {loading ? (
                  'Creating...'
                ) : (
                  <span>
                    <i className="fa-solid fa-check buttonIcon"></i> Create
                  </span>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
