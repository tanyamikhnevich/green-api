import axios from 'axios';

export const sendMessage = async (
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
  message: string,
) => {
  try {
    if (message.length > 20000) return alert('Message very long');
    const response = await axios.post(
      `https://${idInstance.slice(0, 4)}.api.greenapi.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
      { chatId, message },
    );
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};

export interface IncomingMessage {
  receiptId: number;
  body: {
    typeWebhook: string;
    instanceData: {
      idInstance: string;
      wid: string;
    };
    messageData: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
    senderData: {
      chatId: string;
      chatName?: string;
      sender: string;
      senderContactName?: string;
      senderName: string;
    };
    timestamp: number;
  };
}

export const receiveMessage = async (
  idInstance: string,
  apiTokenInstance: string,
):Promise<IncomingMessage | null> => {
  try {
    const response = await axios.get(
      `https://${idInstance.slice(0, 4)}.api.greenapi.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error receiving messages:', error);
    return null;
  }
};

export const deleteNotification = async (
  idInstance: string,
  apiTokenInstance: string,
  receiptId: number,
) => {
  try {
    const response = await axios.delete(
      `https://${idInstance.slice(0, 4)}.api.greenapi.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return null;
  }
};
