import { useState, useEffect, useCallback, useRef } from 'react';
import { Modal } from './Modal';
import { UserAvatar } from './UserAvatar';
import { useUserRepository, useImageRepository, AVATAR_IDS } from '../repositories';
import { ValidationError } from '../errors';
import type { AvatarId } from '../repositories';
import styles from './AddUserModal.module.css';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  age?: string;
  avatar?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  age: string;
  selectedAvatar: AvatarId | null;
}

interface AvatarState {
  images: Record<string, string>;
  loading: boolean;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  age: '',
  selectedAvatar: null,
};

const initialAvatarState: AvatarState = {
  images: {},
  loading: false,
};

const AVATAR_PREVIEW_SIZE = 120;
const AVATAR_PLACEHOLDER_SIZE = 80;

// Helper to revoke blob URLs
const revokeBlobUrls = (urls: Record<string, string>): void => {
  Object.values(urls).forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
};

// Avatar placeholder SVG
const AvatarPlaceholderIcon = () => (
  <svg width={AVATAR_PLACEHOLDER_SIZE} height={AVATAR_PLACEHOLDER_SIZE} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
      fill="currentColor"
    />
    <path
      d="M12 14C7.58172 14 4 15.7909 4 18V20H20V18C20 15.7909 16.4183 14 12 14Z"
      fill="currentColor"
    />
  </svg>
);

export function AddUserModal({ open, onOpenChange, onUserCreated }: AddUserModalProps) {
  const userRepository = useUserRepository();
  const imageRepository = useImageRepository();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [avatarState, setAvatarState] = useState<AvatarState>(initialAvatarState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const avatarUrlsRef = useRef<Record<string, string>>({});

  // Load avatar images when modal opens
  useEffect(() => {
    if (!open) {
      revokeBlobUrls(avatarUrlsRef.current);
      avatarUrlsRef.current = {};
      setAvatarState(initialAvatarState);
      return;
    }

    let cancelled = false;
    setAvatarState((prev) => ({ ...prev, loading: true }));

    const loadAvatars = async () => {
      const images: Record<string, string> = {};
      try {
        await Promise.all(
          AVATAR_IDS.map(async (avatarId) => {
            try {
              const url = await imageRepository.get(`${avatarId}.jpg`);
              if (!cancelled) {
                images[avatarId] = url;
                avatarUrlsRef.current[avatarId] = url;
              } else {
                // Revoke URL if request was cancelled
                revokeBlobUrls({ [avatarId]: url });
              }
            } catch {
              // Skip if image fails to load
            }
          })
        );
        if (!cancelled) {
          setAvatarState({ images, loading: false });
        } else {
          revokeBlobUrls(images);
        }
      } finally {
        if (!cancelled) {
          setAvatarState((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    loadAvatars();

    return () => {
      cancelled = true;
      revokeBlobUrls(avatarUrlsRef.current);
      avatarUrlsRef.current = {};
    };
  }, [open, imageRepository]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setErrors({});
      setSubmitError(null);
      setSuccessMessage(null);
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = Number(formData.age.trim());
      if (isNaN(ageNum) || ageNum <= 0 || !Number.isInteger(ageNum)) {
        newErrors.age = 'Age must be a positive whole number';
      }
    }

    if (!formData.selectedAvatar) {
      newErrors.avatar = 'Please select an avatar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      setSubmitError(null);
      setSuccessMessage(null);

      try {
        const user = {
          id: crypto.randomUUID(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          age: Number(formData.age.trim()),
          profileImageUrl: formData.selectedAvatar ? `${formData.selectedAvatar}.jpg` : '',
        };

        await userRepository.add(user);
        setLoading(false);
        setSuccessMessage('User created successfully!');
        
        // Close modal after showing success message
        setTimeout(() => {
          onOpenChange(false);
          onUserCreated?.();
        }, 1500);
      } catch (error) {
        if (ValidationError.isValidationError(error)) {
          // Map repository validation errors to form errors
          const newErrors: FormErrors = {};
          const fieldMap: Record<string, keyof FormErrors> = {
            firstName: 'firstName',
            lastName: 'lastName',
            age: 'age',
          };

          error.propertyErrors.forEach((propertyError) => {
            const field = fieldMap[propertyError.property];
            if (field) {
              newErrors[field] = propertyError.message;
            }
          });

          setErrors((prev) => ({ ...prev, ...newErrors }));
          setSubmitError(error.message);
        } else if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError('Failed to create user. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    },
    [formData, userRepository, onOpenChange, onUserCreated]
  );

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleFieldChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleAgeChange = useCallback((value: string) => {
    // Only allow positive integers
    if (value === '' || /^\d+$/.test(value)) {
      handleFieldChange('age', value);
    }
  }, [handleFieldChange]);

  const handleAvatarSelect = useCallback((avatarId: AvatarId) => {
    setFormData((prev) => ({ ...prev, selectedAvatar: avatarId }));
    setErrors((prev) => ({ ...prev, avatar: undefined }));
  }, []);

  return (
    <Modal isOpen={open} onOpenChange={onOpenChange} title="Add User to System">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarPreview}>
            {formData.selectedAvatar ? (
              <UserAvatar avatarId={`${formData.selectedAvatar}.jpg`} size={AVATAR_PREVIEW_SIZE} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <AvatarPlaceholderIcon />
              </div>
            )}
          </div>
        </div>

        <div className={styles.availableAvatarsSection}>
          <div className={styles.avatarGridLabel}>
            Available Avatars
            {avatarState.loading && <span className={styles.loadingIndicator}> (Loading...)</span>}
          </div>
          <div className={styles.avatarGrid}>
            {AVATAR_IDS.map((avatarId) => (
              <button
                key={avatarId}
                type="button"
                className={`${styles.avatarOption} ${formData.selectedAvatar === avatarId ? styles.selected : ''}`}
                onClick={() => handleAvatarSelect(avatarId)}
                disabled={loading || !!successMessage}
              >
                {avatarState.images[avatarId] ? (
                  <img src={avatarState.images[avatarId]} alt={`Avatar ${avatarId}`} />
                ) : (
                  <div className={styles.avatarLoading}>...</div>
                )}
              </button>
            ))}
          </div>
          {errors.avatar && <div className={styles.errorText}>{errors.avatar}</div>}
        </div>

        <div className={styles.formFields}>
          <div className={styles.field}>
            <label htmlFor="firstName" className={styles.label}>
              First Name <span className={styles.required}>*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              className={errors.firstName ? styles.inputError : styles.input}
              disabled={loading || !!successMessage}
            />
            {errors.firstName && <div className={styles.errorText}>{errors.firstName}</div>}
          </div>

          <div className={styles.field}>
            <label htmlFor="lastName" className={styles.label}>
              Last Name <span className={styles.required}>*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              className={errors.lastName ? styles.inputError : styles.input}
              disabled={loading || !!successMessage}
            />
            {errors.lastName && <div className={styles.errorText}>{errors.lastName}</div>}
          </div>

          <div className={styles.field}>
            <label htmlFor="age" className={styles.label}>
              Age <span className={styles.required}>*</span>
            </label>
            <input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleAgeChange(e.target.value)}
              className={errors.age ? styles.inputError : styles.input}
              disabled={loading || !!successMessage}
              min="1"
              step="1"
            />
            {errors.age && <div className={styles.errorText}>{errors.age}</div>}
          </div>
        </div>

        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        {submitError && <div className={styles.submitError}>{submitError}</div>}

        <div className={styles.actions}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton} disabled={loading || !!successMessage}>
            Cancel
          </button>
          <button type="submit" className={styles.createButton} disabled={loading || !!successMessage}>
            {loading ? 'Creating...' : '✓ Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
