// lib/Socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (socket) {
        console.log("🔄 Using existing socket:", socket.id || "no-id");
        return socket;
    }

    const token = typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || ""
        : "";

    console.log("🔑 Token exists:", !!token);

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://backend.cleennconnect.com";

    console.log("🌐 Connecting to:", SOCKET_URL);

    socket = io(SOCKET_URL, {
        auth: {
            token: token,
        },
        extraHeaders: {
            Authorization: `Bearer ${token}`,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
    });

    // Connection events with detailed logging
    socket.on("connect", () => {
        console.log("✅ Socket connected successfully!");
        console.log("🆔 Socket ID:", socket?.id);
        console.log("📡 Transport:", socket?.io?.engine?.transport?.name);
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Socket Connection Error:", err.message);
        console.error("📋 Error details:", err);
    });

    socket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
    });

    socket.on("reconnect", (attemptNumber) => {
        console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
        console.log("🆔 New Socket ID:", socket?.id);
    });

    // Log all events for debugging
    socket.onAny((eventName, ...args) => {
        if (!eventName.startsWith("_")) { // Skip internal events
            console.log(`📡 Event: ${eventName}`, args);
        }
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

// Helper function to check socket status
export const getSocketStatus = () => {
    if (!socket) return { connected: false, id: null, rooms: [] };
    return {
        connected: socket.connected,
        id: socket.id || null,
        rooms: Array.from(socket.rooms || []),
    };
};