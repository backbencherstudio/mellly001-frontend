"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    useAllConversationUserQuery,
    useAllConversationIdQuery,
    useSendConversationMessageMutation,
} from "@/redux/features/chattingAndSocket/socket";
import { getSocket } from "@/lib/Socket";
import ConversationList from "@/components/dashboard/Support/ConversationList";
import ChatArea from "@/components/dashboard/Support/ChatArea";
interface Message {
    id: string;
    text: string;
    sender: "user" | "admin";
    timestamp: string;
    createdAt?: string;
    attachments?: any[];
    attachment_urls?: string[];
}

interface FileWithPreview {
    file: File;
    previewUrl?: string;
}

const getImageUrl = (urlInput: any) => {
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

    const { data: conversationListData, isLoading: isUsersLoading, isError: isUsersError } =
        useAllConversationUserQuery(undefined);

    const conversations = Array.isArray(conversationListData?.conversations)
        ? conversationListData.conversations
        : Array.isArray(conversationListData?.data?.conversations)
            ? conversationListData.data.conversations
            : Array.isArray(conversationListData)
                ? conversationListData
                : [];

    const { data: messagesData, isLoading: isMessagesLoading, refetch: refetchMessages } =
        useAllConversationIdQuery(selectedConversationId!, { skip: !selectedConversationId });

    const selectedConversation = conversations.find((c: any) => c.conversation_id === selectedConversationId);

    const rawMessages =
        messagesData?.data?.messages || messagesData?.data || messagesData?.messages || [];

    const oppositeUser = messagesData?.oppositeUser;

    const messages: Message[] = Array.isArray(rawMessages)
        ? rawMessages
            .map((msg: any) => {
                const senderObj = typeof msg.sender === "object" ? msg.sender : null;
                const senderId = senderObj?._id || senderObj?.id || msg.sender;
                const oppositeUserId = oppositeUser?.id || selectedConversation?.opponent?.userId;
                const isUser = oppositeUserId && senderId === oppositeUserId;

                return {
                    id: msg._id || msg.id,
                    text: msg.content || msg.text || msg.message || "",
                    sender: isUser ? ("user" as const) : ("admin" as const),
                    timestamp: msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "",
                    createdAt: msg.createdAt || msg.created_at,
                    attachments: msg.attachments || [],
                    attachment_urls: msg.attachments_url || msg.attachment_urls || [],
                };
            })
            .sort((a, b) => {
                if (!a.createdAt || !b.createdAt) return 0;
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            })
        : [];

    const [sendMessage, { isLoading: isSending }] = useSendConversationMessageMutation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

        const handleJoinedRoom = (data: any) => {
            console.log(" Joined room:", data?.room_id || data);
        };

        const handleMessage = (response: any) => {
            console.log(" New Message Received:", response);

            const msgConversationId =
                response?.data?.conversationId ||
                response?.conversationId ||
                response?.data?.conversation_id;

            if (!msgConversationId || msgConversationId === selectedConversationId) {
                refetchMessages();
            }
        };

        const handleConnect = () => {
            console.log(" Socket reconnected:", socket.id);
            joinRoom();
        };

        // Join room immediately if already connected
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
    }, [selectedConversationId, refetchMessages]);


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
            let payload: any;
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

            // Notify other users via socket
            const socket = getSocket();
            socket.emit("sendMessage", {
                conversationId: selectedConversationId,
                text: newMessage.trim(),
            });
            console.log("📤 sendMessage emitted via socket");

            // Refetch to show the sent message immediately
            refetchMessages();

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

    const getAllMessageImages = (msg: Message) => {
        const list: string[] = [];
        if (msg.attachment_urls?.length) {
            msg.attachment_urls.forEach((url) => {
                const resolved = getImageUrl(url);
                if (resolved && !list.includes(resolved)) list.push(resolved);
            });
        }
        if (list.length === 0 && msg.attachments?.length) {
            msg.attachments.forEach((item) => {
                const resolved = getImageUrl(item);
                if (resolved && !list.includes(resolved)) list.push(resolved);
            });
        }
        return list;
    };

    const handleImageError = (imgUrl: string) => {
        setBrokenImages((prev) => ({ ...prev, [imgUrl]: true }));
    };

    return (
        <div className="flex h-[calc(100vh-80px)] bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
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



// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import {
//     useAllConversationUserQuery,
//     useAllConversationIdQuery,
//     useSendConversationMessageMutation,
// } from "@/redux/features/chattingAndSocket/socket";
// import { getSocket } from "@/lib/Socket";

// interface Message {
//     id: string;
//     text: string;
//     sender: "user" | "admin";
//     timestamp: string;
//     createdAt?: string;
//     attachments?: any[];
//     attachment_urls?: string[];
// }

// interface ConversationUser {
//     conversation_id: string;
//     opponent?: {
//         userId: string;
//         name: string;
//         avater?: string | null;
//         avatar_url?: string | null;
//         isOnline?: boolean;
//     };
//     lastMessage?: {
//         text: string | null;
//         createdAt: string;
//         attachments?: string[];
//         attachment_urls?: string[];
//     };
//     unreadCount?: number;
// }

// interface FileWithPreview {
//     file: File;
//     previewUrl?: string;
// }

// const getImageUrl = (urlInput: any) => {
//     if (!urlInput) return "";

//     let path = "";
//     if (typeof urlInput === "string") {
//         path = urlInput;
//     } else if (typeof urlInput === "object") {
//         path =
//             urlInput.url ||
//             urlInput.path ||
//             urlInput.file ||
//             urlInput.filename ||
//             urlInput.secure_url ||
//             "";
//     }

//     if (!path) return "";

//     let cleanUrl = path.trim();

//     // If relative path, append base domain
//     if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
//         const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://backend.cleennconnect.com")
//             .replace(/\/api\/?$/, "")
//             .replace(/\/$/, "");

//         if (!cleanUrl.includes("/")) {
//             cleanUrl = `${baseUrl}/public/storage/attachment/${cleanUrl}`;
//         } else {
//             const cleanPath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
//             cleanUrl = `${baseUrl}${cleanPath}`;
//         }
//     }

//     // Double slashes clean (http:// or https:// portion thik rekhe)
//     cleanUrl = cleanUrl.replace(/([^:]\/)\/+/g, "$1");

//     // Raw spaces and parenthesis fix for browser img tag
//     return encodeURI(decodeURI(cleanUrl));
// };

// export default function SupportPage() {
//     const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
//     const [newMessage, setNewMessage] = useState("");
//     const [search, setSearch] = useState("");
//     const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
//     const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const {
//         data: conversationListData,
//         isLoading: isUsersLoading,
//         isError: isUsersError,
//     } = useAllConversationUserQuery(undefined);

//     const conversations: ConversationUser[] = Array.isArray(conversationListData?.conversations)
//         ? conversationListData.conversations
//         : Array.isArray(conversationListData?.data?.conversations)
//             ? conversationListData.data.conversations
//             : Array.isArray(conversationListData)
//                 ? conversationListData
//                 : [];

//     const {
//         data: messagesData,
//         isLoading: isMessagesLoading,
//         refetch: refetchMessages,
//     } = useAllConversationIdQuery(selectedConversationId!, {
//         skip: !selectedConversationId,
//     });

//     const selectedConversation = conversations.find(
//         (c) => c.conversation_id === selectedConversationId
//     );

//     const rawMessages =
//         messagesData?.data?.messages ||
//         messagesData?.data ||
//         messagesData?.messages ||
//         [];

//     const oppositeUser = messagesData?.oppositeUser;

//     // 🛠️ FIX 2: Correct Sender Identification logic
//     const messages: Message[] = Array.isArray(rawMessages)
//         ? rawMessages
//             .map((msg: any) => {
//                 const senderObj = typeof msg.sender === "object" ? msg.sender : null;
//                 const senderId = senderObj?._id || senderObj?.id || msg.sender;
//                 const oppositeUserId = oppositeUser?.id || selectedConversation?.opponent?.userId;

//                 const isUser = oppositeUserId && senderId === oppositeUserId;

//                 return {
//                     id: msg._id || msg.id,
//                     text: msg.content || msg.text || msg.message || "",
//                     sender: isUser ? ("user" as const) : ("admin" as const),
//                     timestamp: msg.createdAt
//                         ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//                         : "",
//                     createdAt: msg.createdAt || msg.created_at,
//                     attachments: msg.attachments || [],
//                     attachment_urls: msg.attachments_url || msg.attachment_urls || [],
//                 };
//             })
//             .sort((a, b) => {
//                 if (!a.createdAt || !b.createdAt) return 0;
//                 return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
//             })
//         : [];

//     const [sendMessage, { isLoading: isSending }] = useSendConversationMessageMutation();

//     const filteredConversations = conversations.filter((c) => {
//         const name = c.opponent?.name || "Unknown";
//         return name.toLowerCase().includes(search.toLowerCase());
//     });

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, selectedConversationId]);

//     useEffect(() => {
//         const socket = getSocket();

//         const handleConnect = () => {
//             console.log("Socket connected:", socket.id);
//         };

//         const handleNewMessage = (message: any) => {
//             if (message.conversationId === selectedConversationId) {
//                 refetchMessages();
//             }
//         };

//         socket.on("connect", handleConnect);
//         socket.on("newMessage", handleNewMessage);

//         return () => {
//             socket.off("connect", handleConnect);
//             socket.off("newMessage", handleNewMessage);
//         };
//     }, [selectedConversationId, refetchMessages]);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             const filesArray = Array.from(e.target.files).map((file) => ({
//                 file,
//                 previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
//             }));
//             setSelectedFiles((prev) => [...prev, ...filesArray]);
//         }
//     };

//     const removeFile = (index: number) => {
//         setSelectedFiles((prev) => {
//             const target = prev[index];
//             if (target?.previewUrl) {
//                 URL.revokeObjectURL(target.previewUrl);
//             }
//             return prev.filter((_, i) => i !== index);
//         });
//     };

//     const handleSend = async () => {
//         if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedConversationId) return;

//         try {
//             let payload: any;
//             if (selectedFiles.length > 0) {
//                 const formData = new FormData();
//                 formData.append("conversationId", selectedConversationId);
//                 if (newMessage.trim()) {
//                     formData.append("text", newMessage.trim());
//                 }
//                 selectedFiles.forEach((item) => {
//                     formData.append("attachments", item.file);
//                 });
//                 payload = formData;
//             } else {
//                 payload = {
//                     conversationId: selectedConversationId,
//                     text: newMessage.trim(),
//                 };
//             }

//             await sendMessage(payload).unwrap();

//             const socket = getSocket();
//             socket.emit("sendMessage", {
//                 conversationId: selectedConversationId,
//                 text: newMessage.trim(),
//             });

//             selectedFiles.forEach((item) => {
//                 if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
//             });

//             setNewMessage("");
//             setSelectedFiles([]);
//             if (fileInputRef.current) {
//                 fileInputRef.current.value = "";
//             }
//         } catch (error) {
//             console.error("Message send failed:", error);
//         }
//     };

//     const getUserName = (conv: ConversationUser) => conv.opponent?.name || "Unknown User";

//     const getLastMessage = (conv: ConversationUser) => {
//         if (conv.lastMessage?.text) return conv.lastMessage.text;
//         if (conv.lastMessage?.attachments?.length || conv.lastMessage?.attachment_urls?.length) {
//             return "📷 Photo attachment";
//         }
//         return "No messages yet";
//     };

//     const getLastMessageTime = (conv: ConversationUser) => {
//         if (!conv.lastMessage?.createdAt) return "";
//         const date = new Date(conv.lastMessage.createdAt);
//         return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     };

//     // 🛠️ FIX 3: Dynamic Image List Generator
//     const getAllMessageImages = (msg: Message) => {
//         const list: string[] = [];

//         // 1. Try attachments_url array
//         if (msg.attachment_urls && msg.attachment_urls.length > 0) {
//             msg.attachment_urls.forEach((url) => {
//                 const resolved = getImageUrl(url);
//                 if (resolved && !list.includes(resolved)) list.push(resolved);
//             });
//         }

//         // 2. Fallback to attachments array
//         if (list.length === 0 && msg.attachments && msg.attachments.length > 0) {
//             msg.attachments.forEach((item) => {
//                 const resolved = getImageUrl(item);
//                 if (resolved && !list.includes(resolved)) list.push(resolved);
//             });
//         }

//         return list;
//     };

//     const handleImageError = (imgUrl: string) => {
//         console.error(" Failed Image URL:", imgUrl);
//         setBrokenImages((prev) => ({ ...prev, [imgUrl]: true }));
//     };

//     return (
//         <div className="flex h-[calc(100vh-80px)] bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
//             {/* Sidebar Conversation List */}
//             <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
//                 <div className="p-4 border-b border-gray-100">
//                     <h2 className="text-lg font-semibold text-gray-800">Support</h2>
//                     <p className="text-xs text-gray-500 mt-0.5">User messages from app</p>

//                     <div className="mt-3 relative">
//                         <input
//                             type="text"
//                             placeholder="Search user..."
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03652B] focus:border-transparent"
//                         />
//                         <svg
//                             className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                         </svg>
//                     </div>
//                 </div>

//                 <div className="flex-1 overflow-y-auto">
//                     {isUsersLoading ? (
//                         <div className="p-6 text-center text-gray-400 text-sm">Loading conversations...</div>
//                     ) : isUsersError ? (
//                         <div className="p-6 text-center text-red-400 text-sm">Failed to load conversations</div>
//                     ) : filteredConversations.length === 0 ? (
//                         <div className="p-6 text-center text-gray-400 text-sm">No conversations found</div>
//                     ) : (
//                         filteredConversations.map((conv) => (
//                             <button
//                                 key={conv.conversation_id}
//                                 onClick={() => setSelectedConversationId(conv.conversation_id)}
//                                 className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${selectedConversationId === conv.conversation_id ? "bg-[#F3FFF8]" : ""
//                                     }`}
//                             >
//                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#03652B] to-[#00A63E] flex items-center justify-center text-white font-medium text-sm shrink-0">
//                                     {getUserName(conv).charAt(0).toUpperCase()}
//                                 </div>

//                                 <div className="flex-1 min-w-0">
//                                     <div className="flex items-center justify-between">
//                                         <p
//                                             className={`text-sm font-medium truncate ${selectedConversationId === conv.conversation_id ? "text-[#03652B]" : "text-gray-900"
//                                                 }`}
//                                         >
//                                             {getUserName(conv)}
//                                         </p>
//                                         <span className="text-[11px] text-gray-400 shrink-0 ml-2">
//                                             {getLastMessageTime(conv)}
//                                         </span>
//                                     </div>
//                                     <p className="text-xs text-gray-500 truncate mt-0.5">
//                                         {getLastMessage(conv)}
//                                     </p>
//                                 </div>

//                                 {conv.unreadCount && conv.unreadCount > 0 ? (
//                                     <span className="bg-[#03652B] text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
//                                         {conv.unreadCount}
//                                     </span>
//                                 ) : null}
//                             </button>
//                         ))
//                     )}
//                 </div>
//             </div>

//             {/* Chat Area */}
//             <div className="flex-1 flex flex-col bg-gray-50">
//                 {!selectedConversation ? (
//                     <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
//                         <svg className="w-16 h-16 mb-4 opacity-40 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                         </svg>
//                         <p className="text-sm">Select a user to view conversation</p>
//                     </div>
//                 ) : (
//                     <>
//                         {/* Header */}
//                         <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
//                             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#03652B] to-[#00A63E] flex items-center justify-center text-white font-medium text-sm">
//                                 {getUserName(selectedConversation).charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                                 <p className="text-sm font-semibold text-gray-900">
//                                     {getUserName(selectedConversation)}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Messages Box */}
//                         <div className="flex-1 overflow-y-auto p-5 space-y-3 flex flex-col">
//                             {isMessagesLoading ? (
//                                 <div className="text-center text-gray-400 text-sm py-10">Loading messages...</div>
//                             ) : messages.length === 0 ? (
//                                 <div className="text-center text-gray-400 text-sm py-10">No messages yet</div>
//                             ) : (
//                                 messages.map((msg) => {
//                                     const imageList = getAllMessageImages(msg);

//                                     return (
//                                         <div
//                                             key={msg.id}
//                                             className={`flex w-full ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
//                                         >
//                                             <div
//                                                 className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${msg.sender === "admin"
//                                                     ? "bg-[#03652B] text-white rounded-br-md"
//                                                     : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
//                                                     }`}
//                                             >
//                                                 {msg.text && <p className="break-words">{msg.text}</p>}

//                                                 {imageList.length > 0 && (
//                                                     <div className="mt-2 flex flex-wrap gap-2">
//                                                         {imageList.map((imgUrl, idx) =>
//                                                             brokenImages[imgUrl] ? (
//                                                                 <div
//                                                                     key={`${imgUrl}-${idx}`}
//                                                                     className="w-32 h-24 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-400 text-[11px] text-center px-2"
//                                                                 >
//                                                                     Image not available
//                                                                 </div>
//                                                             ) : (
//                                                                 <img
//                                                                     key={`${imgUrl}-${idx}`}
//                                                                     src={imgUrl}
//                                                                     alt="attachment"
//                                                                     loading="lazy"
//                                                                     referrerPolicy="no-referrer"
//                                                                     crossOrigin="anonymous"
//                                                                     className="max-h-48 max-w-full object-center rounded-lg border border-gray-200 bg-gray-100 cursor-pointer"
//                                                                     onLoad={scrollToBottom}
//                                                                     onClick={() => window.open(imgUrl, "_blank")}
//                                                                     onError={() => handleImageError(imgUrl)}
//                                                                 />
//                                                             )
//                                                         )}
//                                                     </div>
//                                                 )}

//                                                 <p
//                                                     className={`text-[10px] mt-1 ${msg.sender === "admin" ? "text-green-200" : "text-gray-400"
//                                                         }`}
//                                                 >
//                                                     {msg.timestamp}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     );
//                                 })
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         {/* Input Box */}
//                         <div className="bg-white border-t border-gray-200 p-4">
//                             {selectedFiles.length > 0 && (
//                                 <div className="flex flex-wrap gap-2 mb-3">
//                                     {selectedFiles.map((item, idx) => (
//                                         <div key={idx} className="relative w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
//                                             {item.previewUrl ? (
//                                                 <img
//                                                     src={item.previewUrl}
//                                                     alt="preview"
//                                                     className="w-full h-full object-cover"
//                                                 />
//                                             ) : (
//                                                 <span className="text-[9px] text-gray-500 p-1 truncate max-w-full text-center">{item.file.name}</span>
//                                             )}
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeFile(idx)}
//                                                 className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs shadow-sm hover:bg-red-600"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             <div className="flex items-center gap-3">
//                                 <label className="cursor-pointer p-2.5 text-gray-500 hover:text-[#03652B] hover:bg-gray-100 rounded-full transition-colors shrink-0">
//                                     <input
//                                         ref={fileInputRef}
//                                         type="file"
//                                         multiple
//                                         accept="image/*,application/pdf"
//                                         onChange={handleFileChange}
//                                         className="hidden"
//                                         disabled={isSending}
//                                     />
//                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
//                                     </svg>
//                                 </label>

//                                 <input
//                                     type="text"
//                                     placeholder="Type your reply..."
//                                     value={newMessage}
//                                     onChange={(e) => setNewMessage(e.target.value)}
//                                     onKeyDown={(e) => e.key === "Enter" && !isSending && handleSend()}
//                                     disabled={isSending}
//                                     className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#03652B] focus:border-transparent disabled:bg-gray-100"
//                                 />
//                                 <button
//                                     onClick={handleSend}
//                                     disabled={(!newMessage.trim() && selectedFiles.length === 0) || isSending}
//                                     className="bg-[#03652B] hover:bg-[#025022] disabled:bg-gray-300 text-white p-2.5 rounded-full transition-colors cursor-pointer shrink-0"
//                                 >
//                                     {isSending ? (
//                                         <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                     ) : (
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                                         </svg>
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }