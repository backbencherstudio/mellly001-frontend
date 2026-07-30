"use client"
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket: Socket | null = null;
let currentToken: string = "";

export const getSocket = (): Socket => {
    const token = typeof window !== "undefined"
        ? Cookies.get("token") || ""
        : "";

    // If token changed (e.g. after login), force reconnect with new token
    if (socket && currentToken !== token) {
        console.log("🔄 Token changed, recreating socket");
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }

    if (socket && socket.connected) {
        return socket;
    }

    if (socket && !socket.connected) {
        console.log("🔌 Stale socket detected, creating new connection");
        socket.removeAllListeners();
        socket = null;
    }

    currentToken = token;
    console.log(" Token exists:", !!token);

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://backend.cleennconnect.com";
    console.log(" Connecting to:", SOCKET_URL);

    socket = io(SOCKET_URL, {
        extraHeaders: {
            authorization: token ? `Bearer ${token}` : "",
        },
        transports: ["polling", "websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 10000,
    });

    socket.on("connect", () => {
        console.log(" Connected:", socket?.id);
    });

    socket.onAny((event, data) => {
        console.log(" Event:", event);
        console.log(" Data:", data);
    });

    socket.on("connect_error", (err) => {
        console.log(" Connect Error:", err.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected, reason:", reason);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log("🔌 Disconnecting socket:", socket.id);
        socket.disconnect();
        socket = null;
    }
};

export const getSocketStatus = () => {
    if (!socket) return { connected: false, id: null, rooms: [] as string[] };
    return {
        connected: socket.connected,
        id: socket.id || null,
        rooms: Array.from((socket as Socket & { rooms: Set<string> }).rooms || []),
    };
};