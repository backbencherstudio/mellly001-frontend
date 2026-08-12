"use client"

import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentToken: string = "";

const createSocket = (token: string): Socket => {
    const SOCKET_URL = (
        process.env.NEXT_PUBLIC_SOCKET_URL ||
        process.env.NEXT_SOCKET_API_URL ||
        "https://backend.cleennconnect.com"
    ).replace(/\/$/, "");

    console.log("Connecting to:", SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
        auth: {
            token: token || "",
        },
        extraHeaders: {
            authorization: token ? `Bearer ${token}` : "",
        },
        // Fallback: some backends read token from query params
        query: {
            token: token || "",
        },
        transports: ["websocket", "polling"],
        upgrade: true,
        rememberUpgrade: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500,
        reconnectionDelayMax: 5000,
        timeout: 15000,
        forceNew: false,
    });

    newSocket.on("connect", () => {
        console.log("Connected:", newSocket.id);
    });
    newSocket.on("message", () => {
      
    });

    newSocket.on("reconnect", (attempt) => {
        console.log("Socket reconnected after attempt:", attempt, "new id:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
       
    });

    // newSocket.on("disconnect", (reason) => {
    //     console.log("Socket disconnected, reason:", reason);
    // });

    newSocket.on("reconnect_attempt", (attempt) => {
        console.log("Reconnect attempt:", attempt);
    });

    newSocket.on("reconnect_failed", () => {
      
    });

    return newSocket;
};

export const getSocket = (): Socket => {
    const token = typeof window !== "undefined"
        ? Cookies.get("token") || ""
        : "";

    if (socket && currentToken !== token) {
       
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }

    if (socket) {
        if (socket.connected) {
            return socket;
        }

      
        socket.connect();
        return socket;
    }

    currentToken = token;
    console.log("Token exists:", !!token);

    socket = createSocket(token);
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
    currentToken = "";
};


export const getSocketStatus = () => {
    if (!socket) return { connected: false, id: null, rooms: [] as string[] };
    return {
        connected: socket.connected,
        id: socket.id || null,
        rooms: Array.from((socket as Socket & { rooms: Set<string> }).rooms || []),
    };
};