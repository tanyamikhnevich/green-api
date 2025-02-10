import React, { useState } from 'react';
import { Button } from '../../shared';
import styles from './creating-chat-modal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (name: string, phone: string) => void;
}

export function CreatingChatModal({ isOpen, onClose, onCreateChat }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length > 200) {
      setError('Name cannot exceed 200 characters.');
    } else if (value.trim() === '') {
      setError('Name cannot be empty.');
    } else {
      setError('');
    }
    setName(value);
  };

  const handleCreate = () => {
    if (!name || !phone) {
      alert('Please enter both Name and Phone Number');
      return;
    }

    onCreateChat(name, phone);
    setName('');
    setPhone('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Create New Chat</h2>
        <div>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={handleChange}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
        <input
          type="text"
          placeholder="Enter Phone Number without +"
          value={phone}
          maxLength={12}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, '');
            setPhone(onlyNumbers.slice(0, 12));
          }}
          className={styles.input}
        />
        <div className={styles.buttonContainer}>
          <Button name="Create" onClick={handleCreate} />
          <Button name="Cancel" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}
