"use client";

import React, { useState, useEffect, useRef } from "react";

import {
    useAllConversationUserQuery,
    useAllConversationIdQuery,
    useSendConversationMessageMutation,
} from "@/redux/features/chattingAndSocket/socket";
import { getSocket } from "@/lib/Socket";
import ConversationList from "@/components/dashboard/Support/ConversationList";
import ChatArea, { Message } from "@/components/dashboard/Support/ChatArea";

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
        avatar_url?: string;
        avater?: string;
        isOnline?: boolean;
    };
    lastMessage?: {
        text?: string;
        createdAt?: string;
        attachments?: string[];
        attachment_urls?: string[];
    };
    unreadCount?: number;
}

interface FileWithPreview {
    file: File;
    previewUrl?: string;
}

interface JoinRoomResponse {
    room_id?: string;
}

interface MessageResponse {
    conversationId?: string;
    conversation_id?: string;
    data?: {
        conversationId?: string;
        conversation_id?: string;
        data?: {
            conversationId?: string;
            conversation_id?: string;
        };
    };
}

const getImageUrl = (urlInput: string | Attachment | null | undefined): string => {
    if (!urlInput) return "";
    let path = "";
    if (typeof urlInput === "string") path = urlInput;
    else if (typeof urlInput === "object") {
        path = urlInput.url || urlInput.path || urlInput.file || urlInput.filename || urlInput.secure_url || "";
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



export default function SupportPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [search, setSearch] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        data: conversationListData,
        isLoading: isUsersLoading,
        isError: isUsersError,
        refetch: refetchConversations,
    } = useAllConversationUserQuery(undefined);

    const conversations = Array.isArray(conversationListData?.conversations)
        ? conversationListData.conversations
        : Array.isArray(conversationListData?.data?.conversations)
            ? conversationListData.data.conversations
            : Array.isArray(conversationListData)
                ? conversationListData
                : [];

    const { data: messagesData, isLoading: isMessagesLoading, refetch: refetchMessages } =
        useAllConversationIdQuery(selectedConversationId!, { skip: !selectedConversationId });



    const selectedConversation = conversations.find(
        (c: Conversation) => c.conversation_id === selectedConversationId
    );

    const rawMessages =
        messagesData?.data?.messages || messagesData?.data || messagesData?.messages || [];

    const oppositeUser = messagesData?.oppositeUser;

    const messages: Message[] = Array.isArray(rawMessages)
        ? rawMessages
            .map((msg: Record<string, unknown>): Message => {
                const senderObj = typeof msg.sender === "object" ? (msg.sender as Record<string, unknown>) : null;
                const senderId = senderObj?._id || senderObj?.id || (msg.sender as string);
                const oppositeUserId = oppositeUser?.id || selectedConversation?.opponent?.userId;
                const isUser = oppositeUserId && senderId === oppositeUserId;

                return {
                    id: (msg._id || msg.id) as string,
                    text: (msg.content || msg.text || msg.message || "") as string,
                    sender: isUser ? ("user" as const) : ("admin" as const),
                    timestamp: msg.createdAt
                        ? new Date(msg.createdAt as string | number | Date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "",
                    createdAt: (msg.createdAt || msg.created_at) as string | undefined,
                    attachments: (msg.attachments || []) as Attachment[],
                    attachment_urls: (msg.attachments_url || msg.attachment_urls || []) as string[],
                };
            })
            .sort((a, b) => {
                if (!a.createdAt || !b.createdAt) return 0;
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            })
        : [];

    const [sendMessage, { isLoading: isSending }] = useSendConversationMessageMutation();

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            const parent = messagesEndRef.current.parentElement;
            if (parent) {
                parent.scrollTop = parent.scrollHeight;
            } else {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedConversationId]);



    useEffect(() => {
        if (!selectedConversationId) return;

        const socket = getSocket();

        const joinRoom = () => {
            console.log(" Joining room:", selectedConversationId);
            socket.emit("joinroom", { room_id: selectedConversationId });
        };

        const handleJoinedRoom = (data: JoinRoomResponse | string) => {
            console.log(" Joined room:", typeof data === "string" ? data : data?.room_id);
        };

        const handleMessage = (response: MessageResponse) => {
            console.log(" New Message Received:", response);

            const incomingConversationId =
                response?.data?.conversationId ||
                response?.conversationId ||
                response?.data?.conversation_id ||
                response?.data?.data?.conversationId ||
                response?.data?.data?.conversation_id;

            refetchConversations();

            if (!incomingConversationId || incomingConversationId === selectedConversationId) {
                refetchMessages();
            }
        };

        const handleConnect = () => {
            console.log(" Socket reconnected:", socket.id);
            joinRoom();
        };

        if (socket.connected) {
            joinRoom();
        }

        socket.on("connect", handleConnect);
        socket.on("joinedRoom", handleJoinedRoom);
        socket.on("message", handleMessage);
        socket.on("newMessage", handleMessage);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("joinedRoom", handleJoinedRoom);
            socket.off("message", handleMessage);
            socket.off("newMessage", handleMessage);
        };
    }, [selectedConversationId]);


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

            const socket = getSocket();
            socket.emit("sendMessage", {
                to: selectedConversationId,
                data: {
                    conversationId: selectedConversationId,
                    text: newMessage.trim(),
                },
            });
            console.log("📤 sendMessage emitted via socket");

            refetchMessages();
            refetchConversations();

            selectedFiles.forEach((item) => {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
            });
            setNewMessage("");
            setSelectedFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Message send failed:", error);
        }
    };

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



