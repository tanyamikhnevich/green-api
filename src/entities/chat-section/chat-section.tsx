import React, { useEffect, useRef, useState } from 'react';
import avatar from '../../shared/assets/photo-profile.png';
import { Button, MessageInput } from '../../shared';
import { Chat } from '../sidebar-section/sidebar-section';
import styles from './chat-section.module.scss';

interface Props {
  selectedChat: Chat | null;
  handleSendMessage: (message: string) => void;
  setIsModalOpen: (value: boolean) => void;
}

export function ChatSection({ selectedChat, handleSendMessage, setIsModalOpen }: Props) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (!selectedChat || message.trim() === '') return;
    handleSendMessage(message);
    setMessage('');
  };

  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [selectedChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  return (
    <main className={styles.chatSection}>
      {selectedChat ? (
        <>
          <header className={styles.chatHeaderContainer}>
            <img src={avatar} alt="avatar" className={styles.avatar} />
            <span className={styles.chatName}>{selectedChat.name}</span>
            <Button name="Log out" onClick={logOut} />
          </header>
          <div className={styles.chatMessages} ref={messagesContainerRef}>
            <div className={styles.chatMessagesInner}>
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.message} ${msg.sender === 'me' ? styles.sent : ''}`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <footer className={styles.chatInputSection}>
            <MessageInput
              value={message}
              onChange={(value) => setMessage(value)}
              onSend={(msg) => {
                handleSendMessage(msg);
                setMessage('');
              }}
            />
            <Button name="Send" className={styles.sendButton} onClick={sendMessage} />
          </footer>
        </>
      ) : (
        <>
          <header className={styles.chatHeaderContainer}>
            <img src={avatar} alt="avatar" className={styles.avatar} />
            <Button name="Log out" onClick={logOut} />
          </header>
          <div className={styles.noChatSelected}>
            <Button name="New Chat" className={styles.newChatButton} onClick={() => setIsModalOpen(true)} />
          </div>
        </>
      )}
    </main>
  );
}
