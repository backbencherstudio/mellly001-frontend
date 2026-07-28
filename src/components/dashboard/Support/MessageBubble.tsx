"use client";

interface MessageBubbleProps {
    text: string;
    timestamp: string;
    isAdmin: boolean;
    imageList: string[];
    brokenImages: Record<string, boolean>;
    onImageError: (url: string) => void;
    onImageLoad: () => void;
}

export default function MessageBubble({
    text,
    timestamp,
    isAdmin,
    imageList,
    brokenImages,
    onImageError,
    onImageLoad,
}: MessageBubbleProps) {
    return (
        <div className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isAdmin
                        ? "bg-[#03652B] text-white rounded-br-md"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                    }`}
            >
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
                                    onClick={() => window.open(imgUrl, "_blank")}
                                    onError={() => onImageError(imgUrl)}
                                />
                            )
                        )}
                    </div>
                )}

                <p className={`text-[10px] mt-1 ${isAdmin ? "text-green-200" : "text-gray-400"}`}>
                    {timestamp}
                </p>
            </div>
        </div>
    );
}