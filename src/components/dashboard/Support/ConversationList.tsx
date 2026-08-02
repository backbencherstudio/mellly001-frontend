"use client";

import Image from "next/image";

interface ConversationUser {
    conversation_id: string;
    opponent?: {
        userId: string;
        name: string;
        avater?: string | null;
        avatar_url?: string | null;
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

interface ConversationListProps {
    conversations: ConversationUser[];
    selectedId: string | null;
    search: string;
    isLoading: boolean;
    isError: boolean;
    onSearchChange: (value: string) => void;
    onSelect: (id: string) => void;
}

export default function ConversationList({
    conversations,
    selectedId,
    search,
    isLoading,
    isError,
    onSearchChange,
    onSelect,
}: ConversationListProps) {
    const getUserName = (conv: ConversationUser) => conv.opponent?.name || "Unknown User";
    const getAvatarUrl = (conv: ConversationUser) => {
        return (
            conv.opponent?.avatar_url ||
            conv.opponent?.avater ||
            null
        );
    };





    const getLastMessage = (conv: ConversationUser) => {
        if (conv.lastMessage?.text) return conv.lastMessage.text;
        if (conv.lastMessage?.attachments?.length || conv.lastMessage?.attachment_urls?.length) {
            return " Photo attachment";
        }
        return "No messages yet";
    };

    const getLastMessageTime = (conv: ConversationUser) => {
        if (!conv.lastMessage?.createdAt) return "";
        return new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filtered = conversations.filter((c) =>
        (c.opponent?.name || "Unknown").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Support</h2>
                <p className="text-xs text-gray-500 mt-0.5">User messages from app</p>

                <div className="mt-3 relative">
                    <input
                        type="text"
                        placeholder="Search user..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03652B] focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-6 text-center text-gray-400 text-sm">Loading conversations...</div>
                ) : isError ? (
                    <div className="p-6 text-center text-red-400 text-sm">Failed to load conversations</div>
                ) : filtered.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No conversations found</div>
                ) : (
                    filtered.map((conv) => (
                        <button
                            key={conv.conversation_id}
                            onClick={() => onSelect(conv.conversation_id)}
                            className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${selectedId === conv.conversation_id ? "bg-[#F3FFF8]" : ""
                                }`}
                        >
                            {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#03652B] to-[#00A63E] flex items-center justify-center text-white font-medium text-sm shrink-0">
                                {getUserName(conv).charAt(0).toUpperCase()}
                            </div> */}

                            {(() => {
                                const avatarUrl = getAvatarUrl(conv);

                                if (avatarUrl) {
                                    return (
                                        <Image
                                            src={avatarUrl}
                                            alt={getUserName(conv)}
                                            width={40}
                                            crossOrigin="anonymous"
                                            height={40}
                                            className="w-10 h-10 rounded-full object-cover shrink-0"
                                            unoptimized
                                        />
                                    );
                                }


                                return (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#03652B] to-[#00A63E] flex items-center justify-center text-white font-medium text-sm shrink-0">
                                        {getUserName(conv).charAt(0).toUpperCase()}
                                    </div>
                                );
                            })()}

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p
                                        className={`text-sm font-medium truncate ${selectedId === conv.conversation_id ? "text-[#03652B]" : "text-gray-900"
                                            }`}
                                    >
                                        {getUserName(conv)}
                                    </p>
                                    <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                                        {getLastMessageTime(conv)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-0.5">{getLastMessage(conv)}</p>
                            </div>

                            {conv.unreadCount && conv.unreadCount > 0 ? (
                                <span className="bg-[#03652B] text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                                    {conv.unreadCount}
                                </span>
                            ) : null}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}