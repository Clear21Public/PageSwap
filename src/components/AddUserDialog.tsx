
import * as Dialog from '@radix-ui/react-dialog';
import styles from './AddUserDialog.module.css';
import { useState } from 'react';

import { Cross2Icon } from "@radix-ui/react-icons";
import { CheckIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "@radix-ui/react-icons";
import { UserAvatar } from './UserAvatar';

export default function AddUserDialog() {
    const [open, setOpen] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [age, setAge] = useState<string>('');
	const [avatarId, setAvatarId] = useState<string | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [saving, setSaving] = useState(false);

	const resetForm = () => {
		setFirstName('');
		setLastName('');
		setAge('');
		setAvatarId(null);
		setErrors({});
		setSaving(false);
	};


    const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
	};

    return (
		<Dialog.Root open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
			<Dialog.Trigger asChild>
				<button type="button" className={styles.addUserButton}>
					<PlusIcon className={styles.plusIcon} aria-hidden="true" />
					<span className={styles.labelText}>Add User</span>
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className={styles.overlay} />
				<Dialog.Content className={styles.content} aria-describedby="add-user-dialog">
					<div className={styles.header}>
						<div className={styles.title}>Add User to System</div>
                        <Dialog.Close asChild>
                            <button className={styles.closeButton} aria-label="Close">
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
					</div>
					<form onSubmit={handleSubmit} className={styles.form} id="add-user-dialog">
						<div className={styles.previewCol}>
							<div className={styles.previewBox}>
								<UserAvatar
									avatarId={avatarId ?? 'placeholder-dp.png'}
									size={135}
								/>
							</div>
							<button
								type="button"
								className={styles.selectAvatarBtn}
								aria-controls="avatar-grid"
								// onClick={() => setAvatarsOpen((v) => !v)}
							>
								Select 
							</button>
                        </div>

						<div className={styles.field}>
							<label className={styles.label} htmlFor="firstName">First name <span className={styles.requiredText} aria-hidden="true">*</span><span className={styles.srOnly}>(required)</span></label>
							<input id="firstName" className={styles.input} value={firstName} onChange={(ev) => setFirstName(ev.target.value)} disabled={saving} required aria-required="true" />
							{errors.firstName && <div className={styles.error}>{errors.firstName}</div>}
						</div>

						<div className={styles.field}>
							<label className={styles.label} htmlFor="lastName">Last name <span className={styles.requiredText} aria-hidden="true">*</span><span className={styles.srOnly}>(required)</span></label>
							<input id="lastName" className={styles.input} value={lastName} onChange={(ev) => setLastName(ev.target.value)} disabled={saving} required aria-required="true" />
							{errors.lastName && <div className={styles.error}>{errors.lastName}</div>}
						</div>

						<div className={styles.field}>
							<label className={styles.label} htmlFor="age">Age <span className={styles.requiredText} aria-hidden="true">*</span><span className={styles.srOnly}>(required)</span></label>
							<input id="age" className={styles.input} type="number" min={1} value={age} onChange={(ev) => setAge(ev.target.value)} disabled={saving} required aria-required="true" />
							{errors.age && <div className={styles.error}>{errors.age}</div>}
						</div>

						{errors.form && <div className={`${styles.fullWidth} ${styles.error}`}>{errors.form}</div>}

						<div className={styles.actions}>
                            <div className={styles.cancelContainer}>
								<button type="button" className={`${styles.rootButton} ${styles.cancelBtn}`} onClick={() => setOpen(false)} disabled={saving}>
									Cancel
								</button>
							</div>
                            <div className={styles.createContainer}>
								<button type="submit" className={styles.createButton} disabled={saving}>
									{saving ? 'Saving...' : <><CheckIcon />Create</>}
								</button>
							</div>

						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);

}