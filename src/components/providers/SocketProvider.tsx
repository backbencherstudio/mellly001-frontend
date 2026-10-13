"use client";

import { useEffect, useState } from "react";

import { SocketContext } from "@/hooks/useSocket";
import { getSocket, getSocketStatus, type AppSocket } from "@/lib/Socket";

/**
 * Provides the shared Socket.IO instance to the admin dashboard subtree.
 * Place this inside the dashboard layout so it only runs when the user
 * is authenticated.
 *
 * The socket is lazily created on first render and torn down via the
 * lib/Socket.ts disconnectSocket() call on logout.
 */
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<AppSocket | null>(null);
  const [status, setStatus] = useState(getSocketStatus());

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);
    setStatus(getSocketStatus());

    const syncStatus = () => setStatus(getSocketStatus());

    // connect and disconnect are valid reserved events on the typed socket
    socketInstance.on("connect", syncStatus);
    socketInstance.on("disconnect", syncStatus);
    // reconnect variants fire on the Manager — sync status there too
    socketInstance.io.on("reconnect", syncStatus);

    return () => {
      socketInstance.off("connect", syncStatus);
      socketInstance.off("disconnect", syncStatus);
      socketInstance.io.off("reconnect", syncStatus);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected: status.connected,
        id: status.id,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
