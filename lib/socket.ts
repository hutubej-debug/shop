import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const initSocket = (server: any) => {
  if (!io) {
    io = new SocketIOServer(server, {
      path: '/socket.io',
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('✅ Client connected:', socket.id);

      // Join shopping list room
      socket.join('shopping-list');

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });
  }

  return io;
};

export const getSocket = () => io;

// Emit events to all clients
export const emitItemCreated = (item: any) => {
  io?.to('shopping-list').emit('item:created', item);
};

export const emitItemUpdated = (item: any) => {
  io?.to('shopping-list').emit('item:updated', item);
};

export const emitItemDeleted = (id: number) => {
  io?.to('shopping-list').emit('item:deleted', id);
};

export const emitItemBought = (item: any) => {
  io?.to('shopping-list').emit('item:bought', item);
};
