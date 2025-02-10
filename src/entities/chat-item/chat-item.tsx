import React from 'react';
import avatar from '../../shared/assets/photo-profile.png';
import styles from './chat-item.module.scss';

interface Props {
  name: string;
  message: string;
  phone: string;
  onClick: () => void;
}

export function ChatItem({
  name, message, onClick, phone,
}: Props) {
  return (
    <div className={styles.chatItem} onClick={onClick}>
      <img src={avatar} alt={`${name}'s avatar`} className={styles.avatar} />
      <div className={styles.chatContent}>
        <div className={styles.chatHeader}>
          <div className={styles.chatName}>{name}</div>
          <div>{phone}</div>
        </div>
        <div className={styles.chatMessage}>{message}</div>
      </div>
    </div>
  );
}
