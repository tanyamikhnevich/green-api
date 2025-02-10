import React, { useState, useEffect } from 'react';
import {
  Chat, ChatSection, CreatingChatModal, LoginModal, SidebarSection,
} from './entities';
import { deleteNotification, receiveMessage, sendMessage } from './api/api-requests';
import styles from './App.module.scss';

function App() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    const savedId = localStorage.getItem('idInstance');
    const savedToken = localStorage.getItem('apiTokenInstance');

    if (savedId && savedToken) {
      setIdInstance(savedId);
      setApiTokenInstance(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (idInstance && apiTokenInstance) {
      localStorage.setItem('idInstance', idInstance);
      localStorage.setItem('apiTokenInstance', apiTokenInstance);
      setIsLoggedIn(true);
    }
  };
  const handleCreateChat = (name: string, phone: string) => {
    const chatId = `${phone}@c.us`;
    setChats([...chats, {
      id: chatId, name, phone, messages: [],
    }]);
  };
  const handleSendMessage = async (message: string) => {
    const trimmedMessage = message.trim();
    if (!selectedChat || !trimmedMessage) return;

    const response = await sendMessage(idInstance, apiTokenInstance, selectedChat.id, trimmedMessage);
    if (response) {
      setChats((prevChats) => prevChats.map((chat) => (chat.id === selectedChat.id
        ? {
          ...chat,
          messages: [...chat.messages, { sender: 'me', text: trimmedMessage }],
        }
        : chat)));

      setSelectedChat((prev) => (prev
        ? { ...prev, messages: [...prev.messages, { sender: 'me', text: trimmedMessage }] }
        : null));
    }
  };

  const fetchMessages = async () => {
    if (!idInstance || !apiTokenInstance) return;

    try {
      const response = await receiveMessage(idInstance, apiTokenInstance);

      if (response && response.body) {
        const { receiptId, body } = response;
        if (!body.senderData || !body.messageData) return;
        const { senderData, messageData } = body;
        const { chatId } = senderData;

        const messageText = messageData.textMessageData?.textMessage?.trim();
        if (!messageText) {
          await deleteNotification(idInstance, apiTokenInstance, receiptId);
          return;
        }

        setChats((prevChats) => {
          let chatExists = false;

          const updatedChats = prevChats.map((chat) => {
            if (chat.id === chatId) {
              chatExists = true;
              return {
                ...chat,
                messages: [
                  ...chat.messages,
                  { sender: 'them', text: messageText },
                ],
              };
            }
            return chat;
          });

          if (!chatExists) {
            updatedChats.push({
              id: chatId,
              name: senderData.senderName || chatId,
              messages: [
                { sender: 'them', text: messageText },
              ],
              phone: senderData.sender.replace('@c.us', ''),
            });
          }

          return updatedChats;
        });

        setSelectedChat((prev) => (prev?.id === chatId
          ? {
            ...prev,
            messages: [...prev.messages, { sender: 'them', text: messageText }],
          }
          : prev));

        await deleteNotification(idInstance, apiTokenInstance, receiptId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  return (
    <div className={styles.chatApp}>
      {!isLoggedIn && (
        <LoginModal
          handleLogin={handleLogin}
          idInstance={idInstance}
          setIdInstance={setIdInstance}
          apiTokenInstance={apiTokenInstance}
          setApiTokenInstance={setApiTokenInstance}
        />
      )}
      <CreatingChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateChat={handleCreateChat}
      />

      <SidebarSection setSelectedChat={setSelectedChat} chats={chats} setIsModalOpen={setIsModalOpen} />
      <ChatSection selectedChat={selectedChat} handleSendMessage={handleSendMessage} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}

export default App;
