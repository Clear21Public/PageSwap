import { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { UserAvatar } from './UserAvatar';
import { AvatarPlaceholderIcon } from './AvatarPlaceholderIcon';
import { useUserRepository, useImageRepository, AVATAR_IDS } from '../repositories';
import { ValidationError } from '../errors';
import { revokeBlobUrls } from '../utils/blobUrls';
import type { AvatarId } from '../repositories';
import styles from './AddUserModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

interface AddUserModalProps {
  isOpen: boolean;
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

export function AddUserModal({ isOpen, onOpenChange, onUserCreated }: AddUserModalProps) {
  const userRepository = useUserRepository();
  const imageRepository = useImageRepository();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [avatarState, setAvatarState] = useState<AvatarState>(initialAvatarState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAvatarGrid, setShowAvatarGrid] = useState(false);
  const avatarUrlsRef = useRef<Record<string, string>>({});
  const timeoutRef = useRef<number | null>(null);

  // Load avatar images when modal opens
  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen, imageRepository]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setFormData(initialFormData);
      setErrors({});
      setSubmitError(null);
      setSuccessMessage(null);
      setShowAvatarGrid(false);
      setLoading(false);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Please enter a value';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Please enter a value';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Please enter a value';
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      setSuccessMessage('User created successfully!');
      
      // Close modal after showing success message
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
        onOpenChange(false);
        onUserCreated?.();
        timeoutRef.current = null;
      }, 1500);
    } catch (error) {
      if (ValidationError.isValidationError(error)) {
        // Map repository validation errors to form errors
        const newErrors: FormErrors = {};
        const fieldMap: Record<string, keyof FormErrors> = {
          firstName: 'firstName',
          lastName: 'lastName',
          age: 'age',
        } as const;

        error.propertyErrors.forEach((propertyError) => {
          const field = fieldMap[propertyError.property as keyof typeof fieldMap];
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
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleAgeChange = (value: string) => {
    // Only allow positive integers
    if (value === '' || /^\d+$/.test(value)) {
      handleFieldChange('age', value);
    }
  };

  const handleAvatarSelect = (avatarId: AvatarId) => {
    setFormData((prev) => ({ ...prev, selectedAvatar: avatarId }));
    setErrors((prev) => ({ ...prev, avatar: undefined }));
    setShowAvatarGrid(false);
  };

  const handleToggleAvatarGrid = () => {
    setShowAvatarGrid(!showAvatarGrid);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={<span className={styles.title}>Add User to System</span>}>
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
            <button
              type="button"
              className={styles.avatarSelectButton}
              onClick={handleToggleAvatarGrid}
              disabled={loading || !!successMessage}
            >
              Select {showAvatarGrid ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
            </button>
          </div>
        </div>

        {showAvatarGrid && (
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
                aria-label={`Select avatar ${avatarId}`}
                aria-pressed={formData.selectedAvatar === avatarId}
              >
                {avatarState.images[avatarId] ? (
                  <img src={avatarState.images[avatarId]} alt={`Avatar ${avatarId}`} />
                ) : (
                  <div className={styles.avatarLoading} aria-label="Loading avatar">...</div>
                )}
              </button>
            ))}
            </div>
            {errors.avatar && <div className={styles.errorText}>{errors.avatar}</div>}
          </div>
        )}

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
