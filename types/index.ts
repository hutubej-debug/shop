import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseServerIO = {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export interface SocketServer extends NetServer {
  io?: SocketIOServer;
}

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export interface CreateItemDTO {
  productId: number;
  storeId: number;
  quantity?: number;
  notes?: string;
}

export interface UpdateItemDTO {
  productId?: number;
  storeId?: number;
  quantity?: number;
  notes?: string;
  isBought?: boolean;
}

export interface CreateProductDTO {
  name: string;
  categoryId: number;
  price?: number;
}
