import * as React from "react";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { faker } from '@faker-js/faker';
import {useUserRepository} from '../repositories';
import styles from './AddUserDialog.module.css';
import {useCallback, useState} from "react";
import {SelectUserAvatar} from "./SelectUserAvatar.tsx";
import type {IUser} from "../types/IUser.ts";

type TUserDetailsErrorState = Partial<Record<keyof IUser, boolean>>;

export function AddUserDialog() {
    const [open, setOpen] = useState(false);
    const [serverErrors, setServerErrors] = useState<TUserDetailsErrorState>({
        firstName: false,
        lastName: false,
    });

    const [avatarId, setAvatarId] = useState('');

    const userRepo = useUserRepository();

    const formSubmitHandler = useCallback((event: React.SyntheticEvent<HTMLFormElement>) => {
        const userData = Object.fromEntries(new FormData(event.currentTarget)) as Partial<IUser>;

        console.log(userData);
        event.preventDefault();
        setOpen(false);
    }, []);
    return <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
            <button className={`${styles.dialogButton} ${styles.green}`}>+ Add User</button>
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className={`${styles.dialogOverlay}`}/>
            <Dialog.Content className={`${styles.dialogContent}`}>
                <Dialog.Title className={`${styles.dialogTitle}`}>Add User to System</Dialog.Title>
                <Form.Root className={`${styles.formContent}`} onSubmit={formSubmitHandler}>
                    <Form.Field className={`${styles.fieldset}`} name="profileImageUrl">
                        <Form.Control asChild>
                            <input type="hidden" value={avatarId}/>
                        </Form.Control>
                    </Form.Field>
                    <Form.Field className={`${styles.fieldset}`} name="firstName">
                        <Form.Label className={`${styles.label}`}>
                            First Name <span className={`${styles.requiredAsterisk}`}>*</span>
                        </Form.Label>
                        <Form.Control asChild>
                            <input className={`${styles.input}`} defaultValue="Pedro" required/>
                        </Form.Control>
                        <Form.Message className={`${styles.formMessage} ${styles.error}`} match="valueMissing">
                            Please enter your first name
                        </Form.Message>
                    </Form.Field>
                    <Form.Field className={`${styles.fieldset}`} name="lastName">
                        <Form.Label className={`${styles.label}`}>
                            Last Name <span className={`${styles.requiredAsterisk}`}>*</span>
                        </Form.Label>
                        <Form.Control asChild>
                            <input className={`${styles.input}`} defaultValue="Duarte" required/>
                        </Form.Control>
                        <Form.Message className={`${styles.formMessage} ${styles.error}`} match="valueMissing">
                            Please enter your last name
                        </Form.Message>
                    </Form.Field>
                    <Form.Field className={`${styles.fieldset}`} name="age">
                        <Form.Label className={`${styles.label}`}>
                            Age
                        </Form.Label>
                        <Form.Control asChild>
                            <input className={`${styles.input}`} type="number" defaultValue="32"/>
                        </Form.Control>
                        <Form.Message className={`${styles.formMessage} ${styles.error}`} match={(value: number) => value < 5 || value > 120}>
                            Age must be between 5 and 120.
                        </Form.Message>
                    </Form.Field>
                    <div className={`${styles.dialogButtonWrapper}`}>
                        <Dialog.Close asChild>
                            <button className={`${styles.dialogButton}`}>Cancel</button>
                        </Dialog.Close>
                        <Form.Submit className={`${styles.dialogButton} ${styles.green} ${styles.createButton}`}>
                            <i className="fa-solid fa-check"/>Create
                        </Form.Submit>
                    </div>
                </Form.Root>
                <Dialog.Close asChild>
                    <button className={`${styles.iconButton}`} aria-label="Close">
                        <i className="fa-solid fa-remove"/>
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>;
}