/**
 * Socket.IO typed event definitions matching the backend gateway.
 * Reference: frontend-realtime-integration.md
 */

export type ChatMessage = {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  /** Note: backend field name has a typo — keep as-is to match the server */
  attchment: string[];
  attachments_url: string[];
  sender: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
};

export type RealtimeNotification = {
  userId: string;
  title?: string;
  body?: string;
  type?: string;
  booking_id?: string;
  [key: string]: unknown;
};

/** Events the server sends to connected clients */
export type ServerToClientEvents = {
  /** New message in a conversation room */
  message: (event: { from: string; data: ChatMessage }) => void;
  /** Confirmation that the client joined a room */
  joinedRoom: (event: { room_id: string }) => void;
  /** Legacy broadcast relay — NOT private per-user */
  receiveNotification: (event: RealtimeNotification) => void;
  /** Fired when a user's online status changes */
  userStatusChange: (event: { user_id: string; status: string }) => void;
  /** Broadcast when a message status is updated */
  messageStatusUpdated: (event: { message_id: string; status: string }) => void;
};

/** Events the client sends to the server */
export type ClientToServerEvents = {
  /** Join a conversation room to receive its messages */
  joinroom: (event: { room_id: string }) => void;
  /** Legacy relay — do NOT use to send confidential data */
  sendNotification: (event: RealtimeNotification) => void;
  /** Update read status — not persisted, broadcast only */
  updateMessageStatus: (event: {
    message_id: string;
    status: "SENT" | "DELIVERED" | "READ" | "PENDING";
  }) => void;
};
