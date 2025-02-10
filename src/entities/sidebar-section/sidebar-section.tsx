import React, { Dispatch, SetStateAction } from 'react';
import { ChatItem } from '../chat-item/chat-item';
import { Button } from '../../shared';
import styles from './sidebar-section.module.scss';

export interface Chat {
  id: string;
  name: string;
  messages: { sender: string; text: string }[];
  phone: string;
}

interface Props {
  setSelectedChat: Dispatch<SetStateAction<Chat | null>>;
  chats: Chat[];
  setIsModalOpen: (value: boolean) => void;
}
export function SidebarSection({ setSelectedChat, chats, setIsModalOpen }: Props) {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h2>Chats</h2>
        <Button name="New Chat" className={styles.newChatButton} onClick={() => setIsModalOpen(true)} />
      </header>
      <ul className={styles.chatList}>
        {chats.map((chat) => (
          <li key={chat.id}>
            <ChatItem
              name={chat.name}
              phone={chat.phone}
              message={chat.messages[chat.messages.length - 1]?.text}
              onClick={() => setSelectedChat(chat)}
            />
          </li>
        ))}
      </ul>
    </aside>
  );
}
