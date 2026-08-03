import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-medium">404 - Page Not Found</h1>


            <Link href="/login">
                <button className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg  cursor-pointer">Go Home</button>
            </Link>
        </div>
    );
}