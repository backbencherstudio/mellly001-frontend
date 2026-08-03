"use client";

import React, { useRef } from "react";

import MessageBubble from "./MessageBubble";

interface Message {
    id: string;
    text: string;
    sender: "user" | "admin";
    timestamp: string;
    createdAt?: string;
    attachments?: unknown[];
    attachment_urls?: string[];
    senderName?: string;
    senderAvatar?: string;
}

interface FileWithPreview {
    file: File;
    previewUrl?: string;
}
interface Opponent {
    name?: string;
    isOnline?: boolean;
    avatar_url?: string;
    avater?: string;
}
interface SelectedConversation {
    opponent?: Opponent;
}

interface ChatAreaProps {
    selectedConversation: {
        opponent?: Opponent;
    } | null;
    messages: Message[];
    isMessagesLoading: boolean;
    newMessage: string;
    selectedFiles: FileWithPreview[];
    isSending: boolean;
    brokenImages: Record<string, boolean>;
    onNewMessageChange: (value: string) => void;
    onSend: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
    onImageError: (url: string) => void;
    getAllMessageImages: (msg: Message) => string[];
    scrollToBottom: () => void;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ChatArea({
    selectedConversation,
    messages,
    isMessagesLoading,
    newMessage,
    selectedFiles,
    isSending,
    brokenImages,
    onNewMessageChange,
    onSend,
    onFileChange,
    onRemoveFile,
    onImageError,
    getAllMessageImages,
    scrollToBottom,
    messagesEndRef,
    fileInputRef,
}: ChatAreaProps) {
    if (!selectedConversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-4 opacity-40 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">Select a user to view conversation</p>
            </div>
        );
    }

    const user = selectedConversation?.opponent;
    const userName = selectedConversation.opponent?.name || "Unknown User";
    const statusText = user?.isOnline ? "Online" : "Offline";

    const getAvatarUrl = (conv: SelectedConversation) => {
        return (
            conv.opponent?.avatar_url ??
            conv.opponent?.avater ??
            null
        );
    };
    const avatarUrl = getAvatarUrl(selectedConversation);

    return (
        <div className="flex-1 flex flex-col  bg-gray-50 overflow-y-auto">
            <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#03652B] to-[#00A63E] flex items-center justify-center text-white font-medium text-sm">
                    {
                        <div>
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={userName}
                                    crossOrigin="anonymous"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                userName.charAt(0).toUpperCase()
                            )}
                        </div>
                    }
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <div className="flex items-center gap-1">
                        {/* <div className={`w-2 h-2 rounded-full ${user?.isOnline ? "bg-green-500" : "bg-gray-400"} inline-block mr-1`}></div>


                        <p className="text-xs text-gray-500">{statusText}</p> */}
                    </div>
                </div>

            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 flex flex-col">
                {isMessagesLoading ? (
                    <div className="text-center text-gray-400 text-sm py-10">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-10">No messages yet</div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            text={msg.text}
                            timestamp={msg.timestamp}
                            isAdmin={msg.sender === "admin"}
                            imageList={getAllMessageImages(msg)}
                            brokenImages={brokenImages}
                            onImageError={onImageError}
                            onImageLoad={scrollToBottom}
                            senderName={msg.senderName}
                            senderAvatar={msg.senderAvatar}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
                {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {selectedFiles.map((item, idx) => (
                            <div
                                key={idx}
                                className="relative w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center shrink-0"
                            >
                                {item.previewUrl ? (
                                    <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[9px] text-gray-500 p-1 truncate max-w-full text-center">
                                        {item.file.name}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onRemoveFile(idx)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs shadow-sm hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <label className="cursor-pointer p-2.5 text-gray-500 hover:text-[#03652B] hover:bg-gray-100 rounded-full transition-colors shrink-0">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,application/pdf"
                            onChange={onFileChange}
                            className="hidden"
                            disabled={isSending}
                        />
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </label>

                    <input
                        type="text"
                        placeholder="Type your reply..."
                        value={newMessage}
                        onChange={(e) => onNewMessageChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !isSending && onSend()}
                        disabled={isSending}
                        className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#03652B] focus:border-transparent disabled:bg-gray-100"
                    />

                    <button
                        onClick={onSend}
                        disabled={(!newMessage.trim() && selectedFiles.length === 0) || isSending}
                        className="bg-[#03652B] hover:bg-[#025022] disabled:bg-gray-300 text-white p-2.5 rounded-full transition-colors cursor-pointer shrink-0"
                    >
                        {isSending ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
}
