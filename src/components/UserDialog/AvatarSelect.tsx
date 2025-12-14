import { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { AVATAR_IDS, type AvatarId } from '../../repositories';

import styles from './AvatarSelect.module.css';

type Props = {
  avatarId?: AvatarId;
  setAvatarId: (id: AvatarId) => void
}

// TODO figure out how to wire this into form data
export function AvatarSelect({ avatarId, setAvatarId }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  const currentImage = avatarId ? `./assets/${avatarId}.jpg` : './assets/placeholder-dp.png';

  return(
    <Form.Field className={styles.Container} name="profileImageUrl">
      <div className={styles.Avatar} onClick={() => setOpen(!open)}>
        <img className={styles.Image} src={currentImage} alt="default user image" />
        <div className={styles.SelectToggle}>Select {open ? <i className="fa-solid fa-chevron-up" /> : <i className="fa-solid fa-chevron-down" />}</div>
      </div>
      <Form.Control asChild>
        {open && <div className={styles.AvatarPortal}>
          <div className={styles.PortalTitle}>Available Avatars</div>
          <div className={styles.Array}>
            {AVATAR_IDS.map((id) => {
              return(
                  <img className={styles.ArrayImage} src={`./assets/${id}.jpg`} alt="default user image" key={id} onClick={() => setAvatarId(id)} />
              )
            })}
          </div>
        </div>
        }
      </Form.Control>
    </Form.Field>
  )
}
