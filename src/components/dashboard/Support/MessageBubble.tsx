"use client";

interface MessageBubbleProps {
    text: string;
    timestamp: string;
    isAdmin: boolean;
    imageList: string[];
    brokenImages: Record<string, boolean>;
    onImageError: (url: string) => void;
    onImageLoad: () => void;
    senderName?: string;
    senderAvatar?: string;
}

export default function MessageBubble({
    text,
    timestamp,
    isAdmin,
    imageList,
    brokenImages,
    onImageError,
    onImageLoad,
    senderName,
    senderAvatar,
}: MessageBubbleProps) {
    return (
        <div className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isAdmin
                    ? "bg-[#E5F1EA] text-black rounded-br-md"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                    }`}
            >
                {!isAdmin && (senderName || senderAvatar) && (
                    <div className="flex items-center gap-2 mb-1">
                        {senderAvatar && (
                            <img src={senderAvatar} alt={senderName || "user"} className="w-5 h-5 rounded-full object-cover" />
                        )}
                        <span className="text-[11px] font-medium text-gray-700">{senderName}</span>
                    </div>
                )}
                {text && <p className="break-words">{text}</p>}

                {imageList.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {imageList.map((imgUrl, idx) =>
                            brokenImages[imgUrl] ? (
                                <div
                                    key={`${imgUrl}-${idx}`}
                                    className="w-32 h-24 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-400 text-[11px] text-center px-2"
                                >
                                    Image not available
                                </div>
                            ) : (
                                <img
                                    key={`${imgUrl}-${idx}`}
                                    src={imgUrl}
                                    alt="attachment"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    crossOrigin="anonymous"
                                    className="max-h-48 max-w-full object-center rounded-lg border border-gray-200 bg-gray-100 cursor-pointer"
                                    onLoad={onImageLoad}
                                    // onClick={() => window.open(imgUrl, "_blank")}
                                    onError={() => onImageError(imgUrl)}
                                />
                            )
                        )}
                    </div>
                )}

                <p className={`text-[10px] mt-1 ${isAdmin ? "text-black" : "text-gray-400"}`}>
                    {timestamp}
                </p>
            </div>
        </div>
    );
}
