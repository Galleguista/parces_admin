import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useChat = (conversacionId) => {
  const [messages, setMessages] = useState([]);
  const [isConversationEmpty, setIsConversationEmpty] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const socketRef = useRef(null);

  const token = localStorage.getItem('token');
  console.log('[useChat] Token:', token);

  function parseJwt(token) {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.warn('[useChat] Error al parsear JWT:', e);
      return null;
    }
  }

  const decoded = token ? parseJwt(token) : null;
  const usuario_id = decoded?.sub;
  console.log('[useChat] Payload decodificado:', decoded);
  console.log('[useChat] usuario_id:', usuario_id);

  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ['websocket'],
      auth: { token },
    });

    socketRef.current = socket;

    console.log('[useChat] Socket inicializado');

    socket.on('connect', () => {
      console.log('[ChatSidebar] Socket conectado:', socket.id);
      socket.emit('get_conversations');
    });

    socket.on('conversation_list', (data) => {
      console.log('[ChatSidebar] Conversaciones recibidas:', data);
      setConversations(data);
    });

    socket.on('new_message', (message) => {
      console.log('[useChat] Mensaje recibido:', message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on('disconnect', (reason) => {
      console.log('[ChatSidebar] Socket desconectado:', reason);
    });

    return () => {
      console.log('[ChatSidebar] Desconectando socket');
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (socketRef.current && conversacionId) {
      console.log('[useChat] Entrando a conversacionId:', conversacionId);
      socketRef.current.emit('join_conversation', { conversacion_id: conversacionId });
    }

    return () => {
      if (socketRef.current && conversacionId) {
        console.log('[useChat] Saliendo de conversacionId:', conversacionId);
        socketRef.current.emit('leave_conversation', { conversacion_id: conversacionId });
      }
    };
  }, [conversacionId]);

  const sendMessage = () => {
    if (socketRef.current && newMessage.trim() && conversacionId) {
      console.log('[useChat] Enviando mensaje:', newMessage);
      socketRef.current.emit('send_message', {
        conversacion_id: conversacionId,
        contenido: newMessage,
      });
      setNewMessage('');
    }
  };

  return {
    messages,
    isConversationEmpty: messages.length === 0,
    newMessage,
    setNewMessage,
    sendMessage,
    usuario_id,
    conversations,
  };
};

export default useChat;
