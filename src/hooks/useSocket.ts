"use client";

import { createContext, useContext } from "react";
import type { AppSocket } from "@/lib/Socket";

interface SocketContextValue {
  /** The typed Socket.IO instance — null before connection is established */
  socket: AppSocket | null;
  connected: boolean;
  id: string | null;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
  id: null,
});

/**
 * Consume the shared socket from SocketProvider.
 *
 * @example
 * const { socket, connected } = useSocket();
 */
export const useSocket = () => useContext(SocketContext);

export { SocketContext };
