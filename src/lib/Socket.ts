/**
 * Singleton Socket.IO client.
 *
 * Usage:
 *   - Call getSocket() to get (or lazily create) the shared socket.
 *   - Call disconnectSocket() on logout.
 *   - Use SocketProvider + useSocket() in React components instead of
 *     calling getSocket() directly wherever possible.
 *
 * Auth (per backend docs):
 *   - chat gateway reads the JWT from socket.auth.token
 *   - notification gateway reads userId from socket.query.userId
 */

"use client";

import Cookies from "js-cookie";
import { io, type Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "./socket-types";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;
let currentToken = "";
let currentUserId = "";

function getSocketUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://backend.cleennconnect.com";
  return raw.replace(/\/$/, "").replace(/\/api$/, "");
}

function createSocket(token: string, userId: string): AppSocket {
  const url = getSocketUrl();

  const newSocket: AppSocket = io(url, {
    // Chat gateway authenticates via JWT in auth
    auth: { token },
    // Notification gateway identifies the client by userId in query
    query: { token, userId },
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
    console.info("[Socket] Connected:", newSocket.id);
  });

  newSocket.on("connect_error", (err) => {
    console.error("[Socket] Connection failed:", err.message);
  });

  newSocket.on("disconnect", (reason) => {
    console.info("[Socket] Disconnected, reason:", reason);
  });

  // reconnect fires on the Manager; listen via the socket's io reference
  newSocket.io.on("reconnect", (attempt: number) => {
    console.info("[Socket] Reconnected after attempt", attempt, "| id:", newSocket.id);
  });

  return newSocket;
}

/**
 * Returns the shared socket instance, creating one if needed.
 * If the token or userId has changed (e.g. re-login), the old socket
 * is torn down and a fresh one is created.
 */
export function getSocket(): AppSocket {
  const token =
    typeof window !== "undefined" ? Cookies.get("token") ?? "" : "";
  let userId =
    typeof window !== "undefined"
      ? Cookies.get("userId") ?? localStorage.getItem("userId") ?? ""
      : "";

  // Auto-recovery: if userId cookie is missing but token exists, decode from JWT
  if (!userId && token && typeof window !== "undefined") {
    try {
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const decoded = JSON.parse(
          atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"))
        );
        const extracted =
          decoded?.id || decoded?.userId || decoded?.sub || decoded?._id || "";
        if (extracted) {
          userId = String(extracted);
          Cookies.set("userId", userId, {
            path: "/",
            sameSite: "strict",
            expires: 3650,
          });
          localStorage.setItem("userId", userId);
        }
      }
    } catch {
      // ignore parsing error
    }
  }

  // Re-create if the signed-in user changed
  if (socket && (currentToken !== token || currentUserId !== userId)) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  if (socket) {
    if (!socket.connected) socket.connect();
    return socket;
  }

  currentToken = token;
  currentUserId = userId;
  socket = createSocket(token, userId);
  return socket;
}

/** Tear down the socket — call this on logout. */
export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  currentToken = "";
  currentUserId = "";
}

export function getSocketStatus() {
  if (!socket) return { connected: false, id: null };
  return { connected: socket.connected, id: socket.id ?? null };
}