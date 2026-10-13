"use client";

/**
 * Support / Chat Page
 *
 * Real-time strategy (per backend integration doc):
 * - Messages are sent via REST (POST /api/chat/message/send-message).
 *   Do NOT emit via socket after sending.
 * - The backend emits `message` to other members in the room.
 *   Shape: { from: string; data: ChatMessage }
 * - On receiving `message`, inject the new message directly into local state
 *   so the UI updates instantly without an extra network round-trip.
 * - Also refetch conversations list so the sidebar shows the latest preview.
 * - On reconnect, rejoin the active room and refetch message history (missed
 *   socket events are not replayed by the server).
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  useAllConversationUserQuery,
  useAllConversationIdQuery,
  useSendConversationMessageMutation,
} from "@/redux/features/chattingAndSocket/socket";
import { useSocket } from "@/hooks/useSocket";
import type { ChatMessage as SocketChatMessage } from "@/lib/socket-types";
import ConversationList from "@/components/dashboard/Support/ConversationList";
import ChatArea, { Message } from "@/components/dashboard/Support/ChatArea";

// ---------------------------------------------------------------------------
// Local types
// ---------------------------------------------------------------------------

interface Attachment {
  url?: string;
  path?: string;
  file?: string;
  filename?: string;
  secure_url?: string;
}

interface Conversation {
  conversation_id: string;
  opponent?: {
    userId: string;
    name: string;
    avatar_url?: string | undefined;
    avater?: string | undefined;
    isOnline?: boolean;
  };
  lastMessage?: {
    text: string | null;
    createdAt: string;
    attachments?: string[];
    attachment_urls?: string[];
  };
  unreadCount?: number;
}

interface FileWithPreview {
  file: File;
  previewUrl?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getImageUrl = (urlInput: string | Attachment | null | undefined): string => {
  if (!urlInput) return "";
  let path = "";
  if (typeof urlInput === "string") path = urlInput;
  else if (typeof urlInput === "object") {
    path =
      urlInput.url ||
      urlInput.path ||
      urlInput.file ||
      urlInput.filename ||
      urlInput.secure_url ||
      "";
  }
  if (!path) return "";
  let cleanUrl = path.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "")
      .replace(/\/api\/?$/, "")
      .replace(/\/$/, "");
    if (!cleanUrl.includes("/")) {
      cleanUrl = `${baseUrl}/public/storage/attachment/${cleanUrl}`;
    } else {
      const cleanPath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
      cleanUrl = `${baseUrl}${cleanPath}`;
    }
  }
  cleanUrl = cleanUrl.replace(/([^:]\/)\/+/g, "$1");
  return encodeURI(decodeURI(cleanUrl));
};

/** Convert a raw API/socket message object into the local Message shape */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normaliseMessage = (
  msg: Record<string, unknown>,
  oppositeUserId?: string
): Message => {
  const senderObj =
    typeof msg.sender === "object" ? (msg.sender as Record<string, unknown>) : null;
  const senderId = (senderObj?._id || senderObj?.id || msg.sender) as string;
  const isUser = Boolean(oppositeUserId && senderId === oppositeUserId);

  return {
    id: (msg._id || msg.id) as string,
    text: (msg.content || msg.text || msg.message || "") as string,
    sender: isUser ? "user" : "admin",
    timestamp: msg.createdAt
      ? new Date(msg.createdAt as string).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    createdAt: (msg.createdAt || msg.created_at) as string | undefined,
    attachments: (msg.attachments || []) as Attachment[],
    attachment_urls: (msg.attachments_url || msg.attachment_urls || []) as string[],
    senderName: (senderObj?.name as string) || undefined,
    senderAvatar: (senderObj?.avatar as string) || undefined,
  };
};

/** Convert a socket ChatMessage to the local Message shape */
const normaliseChatMessage = (
  incoming: { from: string; data: SocketChatMessage },
  oppositeUserId?: string
): Message => {
  const { from, data } = incoming;
  const isUser = Boolean(oppositeUserId && from === oppositeUserId);
  return {
    id: data.id,
    text: data.text,
    sender: isUser ? "user" : "admin",
    timestamp: data.createdAt
      ? new Date(data.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    createdAt: data.createdAt,
    attachments: [],
    attachment_urls: data.attachments_url || data.attchment || [],
    senderName: data.sender?.name,
    senderAvatar: data.sender?.avatar ?? undefined,
  };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SupportPage() {
  const { socket } = useSocket();

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  // Extra messages injected via socket (not yet reflected in the RTK Query cache)
  const [socketMessages, setSocketMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------------------
  // REST queries
  // -------------------------------------------------------------------------

  const {
    data: conversationListData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch: refetchConversations,
  } = useAllConversationUserQuery(undefined);

  const conversations: Conversation[] = Array.isArray(conversationListData?.conversations)
    ? conversationListData.conversations
    : Array.isArray(conversationListData?.data?.conversations)
    ? conversationListData.data.conversations
    : Array.isArray(conversationListData)
    ? conversationListData
    : [];

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useAllConversationIdQuery(selectedConversationId!, {
    skip: !selectedConversationId,
  });

  const [sendMessage, { isLoading: isSending }] = useSendConversationMessageMutation();

  // -------------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------------

  const selectedConversation =
    conversations.find((c) => c.conversation_id === selectedConversationId) ?? null;

  const rawMessages: Record<string, unknown>[] =
    messagesData?.data?.messages || messagesData?.data || messagesData?.messages || [];

  const oppositeUserId =
    messagesData?.oppositeUser?.id || selectedConversation?.opponent?.userId;

  /** Messages loaded from REST, chronologically sorted */
  const restMessages: Message[] = Array.isArray(rawMessages)
    ? (rawMessages as Record<string, unknown>[])
        .map((msg) => normaliseMessage(msg, oppositeUserId))
        .sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        })
    : [];

  /**
   * Merge REST messages with socket-injected messages, deduplicating by id.
   * Socket messages that are already present in the REST response (e.g., after
   * a refetch) are dropped to avoid duplicates.
   */
  const restIds = new Set(restMessages.map((m) => m.id));
  const dedupedSocketMessages = socketMessages.filter((m) => !restIds.has(m.id));
  const messages: Message[] = [...restMessages, ...dedupedSocketMessages];

  // -------------------------------------------------------------------------
  // Clear socket-injected messages when the conversation changes or after a
  // successful refetch so we don't accumulate stale entries.
  // -------------------------------------------------------------------------
  useEffect(() => {
    setSocketMessages([]);
  }, [selectedConversationId, messagesData]);

  // -------------------------------------------------------------------------
  // Socket: join room + listen for messages
  // -------------------------------------------------------------------------

  const joinRoom = useCallback(() => {
    if (!socket || !selectedConversationId) return;
    socket.emit("joinroom", { room_id: selectedConversationId });
  }, [socket, selectedConversationId]);

  useEffect(() => {
    if (!socket || !selectedConversationId) return;

    // Join as soon as the socket is connected (or immediately if already so)
    if (socket.connected) {
      joinRoom();
    }

    const handleJoinedRoom = ({ room_id }: { room_id: string }) => {
      console.info("[Chat] Joined room:", room_id);
    };

    /**
     * The backend emits `message` to other room members.
     * Payload: { from: string; data: ChatMessage }
     * We inject it directly into local state for instant rendering.
     */
    const handleMessage = (event: { from: string; data: SocketChatMessage }) => {
      console.info("[Chat] Incoming message from:", event.from);
      const normalised = normaliseChatMessage(event, oppositeUserId);
      setSocketMessages((prev) => {
        // Guard: don't add if already present
        if (prev.some((m) => m.id === normalised.id)) return prev;
        return [...prev, normalised];
      });
      // Keep the conversations sidebar preview up to date
      refetchConversations();
    };

    /**
     * On reconnect, rejoin the room and fetch history.
     * Missed socket events are not replayed by the server.
     */
    const handleReconnect = () => {
      console.info("[Chat] Socket reconnected — rejoining room and refetching history");
      joinRoom();
      refetchMessages();
    };

    socket.on("joinedRoom", handleJoinedRoom);
    socket.on("message", handleMessage);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("joinedRoom", handleJoinedRoom);
      socket.off("message", handleMessage);
      socket.off("connect", handleReconnect);
    };
  }, [socket, selectedConversationId, joinRoom, oppositeUserId, refetchConversations, refetchMessages]);

  // -------------------------------------------------------------------------
  // Scroll to bottom on new messages
  // -------------------------------------------------------------------------

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      const parent = messagesEndRef.current.parentElement;
      if (parent) {
        parent.scrollTop = parent.scrollHeight;
      } else {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, selectedConversationId, scrollToBottom]);

  // -------------------------------------------------------------------------
  // File handling
  // -------------------------------------------------------------------------

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      }));
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const target = prev[index];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  // -------------------------------------------------------------------------
  // Send message — REST only (per backend doc, do NOT emit via socket)
  // -------------------------------------------------------------------------

  const handleSend = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedConversationId) return;

    try {
      let payload: FormData | { conversationId: string; text: string };

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        formData.append("conversationId", selectedConversationId);
        if (newMessage.trim()) formData.append("text", newMessage.trim());
        selectedFiles.forEach((item) => formData.append("attachments", item.file));
        payload = formData;
      } else {
        payload = { conversationId: selectedConversationId, text: newMessage.trim() };
      }

      await sendMessage(payload).unwrap();

      // The sender gets the saved message in the REST response.
      // Other room members receive it via the `message` socket event.
      // Refresh both queries to keep the UI consistent for the sender.
      refetchMessages();
      refetchConversations();

      selectedFiles.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      setNewMessage("");
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("[Chat] Message send failed:", error);
    }
  };

  // -------------------------------------------------------------------------
  // Image helpers
  // -------------------------------------------------------------------------

  const getAllMessageImages = (msg: Message): string[] => {
    const list: string[] = [];
    if (msg.attachment_urls?.length) {
      msg.attachment_urls.forEach((url) => {
        const resolved = getImageUrl(url);
        if (resolved && !list.includes(resolved)) list.push(resolved);
      });
    }
    if (list.length === 0 && msg.attachments?.length) {
      msg.attachments.forEach((item) => {
        const resolved = getImageUrl(item as string | Attachment | null | undefined);
        if (resolved && !list.includes(resolved)) list.push(resolved);
      });
    }
    return list;
  };

  const handleImageError = (imgUrl: string) => {
    setBrokenImages((prev) => ({ ...prev, [imgUrl]: true }));
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-[calc(100dvh-80px)] lg:h-[calc(100vh-80px)] bg-gray-50 rounded-xl overflow-hidden lg:border border-gray-200 shadow-sm">
      <ConversationList
        conversations={conversations}
        selectedId={selectedConversationId}
        search={search}
        isLoading={isUsersLoading}
        isError={isUsersError}
        onSearchChange={setSearch}
        onSelect={setSelectedConversationId}
      />

      <ChatArea
        selectedConversation={selectedConversation}
        messages={messages}
        isMessagesLoading={isMessagesLoading}
        newMessage={newMessage}
        selectedFiles={selectedFiles}
        isSending={isSending}
        brokenImages={brokenImages}
        onNewMessageChange={setNewMessage}
        onSend={handleSend}
        onFileChange={handleFileChange}
        onRemoveFile={removeFile}
        onImageError={handleImageError}
        getAllMessageImages={getAllMessageImages}
        scrollToBottom={scrollToBottom}
        messagesEndRef={messagesEndRef}
        fileInputRef={fileInputRef}
      />
    </div>
  );
}
