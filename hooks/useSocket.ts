'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketInitializer = async () => {
      // Initialize socket.io endpoint
      await fetch('/api/socket');

      socket = io({
        path: '/api/socket',
      });

      socket.on('connect', () => {
        console.log('✅ Connected to Socket.IO');
        setIsConnected(true);
        socket.emit('join:list');
      });

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from Socket.IO');
        setIsConnected(false);
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.emit('leave:list');
        socket.disconnect();
      }
    };
  }, []);

  return { socket, isConnected };
};

export const getSocketInstance = () => socket;
