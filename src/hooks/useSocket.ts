"use client";

import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
  id: string | null;
  rooms: string[];
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
  id: null,
  rooms: [],
});

export const useSocket = () => useContext(SocketContext);

export { SocketContext };
