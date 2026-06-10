export const formatTime = (dateInput: string | Date): string => {
    const date = new Date(dateInput);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
};