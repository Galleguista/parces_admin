import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (chatId) {
      const newSocket = io(import.meta.env.VITE_API_URL, {
        query: { chatId },
        transports: ['websocket'],
        auth: {
          token: localStorage.getItem('token'),
        },
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        newSocket.emit('joinChat', { chatId });
      });

      newSocket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        newSocket.emit('leaveChat', { chatId });
        newSocket.disconnect();
      };
    }
  }, [chatId]);

  const sendMessage = (message) => {
    if (socket && message.trim() !== '') {
      socket.emit('sendMessage', {
        chatId,
        usuarioId: localStorage.getItem('usuario_id'),
        contenido: message,
      });
    }
  };

  return { messages, sendMessage };
};

export default useChat;
