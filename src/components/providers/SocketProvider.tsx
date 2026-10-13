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
  const [socket] = useState<AppSocket | null>(() =>
    typeof window !== "undefined" ? getSocket() : null
  );
  const [status, setStatus] = useState(() => getSocketStatus());

  useEffect(() => {
    if (!socket) return;

    const syncStatus = () => setStatus(getSocketStatus());

    socket.on("connect", syncStatus);
    socket.on("disconnect", syncStatus);
    socket.io.on("reconnect", syncStatus);

    return () => {
      socket.off("connect", syncStatus);
      socket.off("disconnect", syncStatus);
      socket.io.off("reconnect", syncStatus);
    };
  }, [socket]);

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
