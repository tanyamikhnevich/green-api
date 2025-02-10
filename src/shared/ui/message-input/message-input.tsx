import React, { useRef, useState } from 'react';
import styles from './message-input.module.scss';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
}

export const MessageInput = ({ value, onChange, onSend }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [height, setHeight] = useState('auto');
  const resetHeight = () => {
    setHeight('auto');
  };
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = `${Math.min(textareaRef.current.scrollHeight, 8 * 16)}px`;
      textareaRef.current.style.height = newHeight;
      setHeight(newHeight);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim() !== '') {
        onSend(value);
        onChange('');
        resetHeight();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    adjustHeight();
  };

  return (
    <textarea
      ref={textareaRef}
      className={styles.messageInput}
      placeholder="Type a message"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      style={{ height }}
    />
  );
};
