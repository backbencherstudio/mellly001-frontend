"use client";

import * as React from "react";
import { MapPin } from "lucide-react";

interface Props {
    latitude?: number;
    longitude?: number;
    location?: string | null;
}

export default function LocationCell({
    latitude,
    longitude,
    location,
}: Props) {
    const [name, setName] = React.useState(location || "");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (location || latitude == null || longitude == null) return;

        const getLocation = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );

                const data = await res.json();
                const a = data?.address;

                setName(
                    a?.city ||
                    a?.town ||
                    a?.village ||
                    a?.municipality ||
                    a?.county ||
                    "Unknown location"
                );
            } catch {
                setName("Location unavailable");
            } finally {
                setLoading(false);
            }
        };

        getLocation();
    }, [latitude, longitude, location]);

    const mapUrl =
        latitude != null && longitude != null
            ? `https://www.google.com/maps?q=${latitude},${longitude}`
            : null;

    return (
        <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-[#99A1AF]" />

            {mapUrl ? (
                <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#003C80] hover:underline"
                >
                    {loading ? "Loading..." : name || "View Location"}
                </a>
            ) : (
                <span>{name || "N/A"}</span>
            )}
        </div>
    );
}