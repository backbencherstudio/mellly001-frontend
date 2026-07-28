
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://backend.cleennconnect.com/api/", {
            withCredentials: true,

            auth: {
                token: localStorage.getItem("accessToken"),
            },

            extraHeaders: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};