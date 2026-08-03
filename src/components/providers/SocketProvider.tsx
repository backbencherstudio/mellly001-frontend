"use client";

import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";

import { SocketContext } from "@/hooks/useSocket";
import { getSocket, getSocketStatus } from "@/lib/Socket";

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [status, setStatus] = useState(getSocketStatus());

    useEffect(() => {
        const socketInstance = getSocket();
        setSocket(socketInstance);
        setStatus(getSocketStatus());

        const syncStatus = () => setStatus(getSocketStatus());

        if (!socketInstance) return;

        socketInstance.on("connect", syncStatus);
        socketInstance.on("disconnect", syncStatus);
        socketInstance.on("reconnect", syncStatus);
        socketInstance.on("reconnect_attempt", syncStatus);
        socketInstance.on("reconnect_failed", syncStatus);

        return () => {
            socketInstance.off("connect", syncStatus);
            socketInstance.off("disconnect", syncStatus);
            socketInstance.off("reconnect", syncStatus);
            socketInstance.off("reconnect_attempt", syncStatus);
            socketInstance.off("reconnect_failed", syncStatus);
        };
    }, []);

    return (
        <SocketContext.Provider
            value={{
                socket,
                connected: status.connected,
                id: status.id,
                rooms: status.rooms,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}
