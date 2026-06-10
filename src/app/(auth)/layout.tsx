import { Toaster } from "@/components/ui/sonner";
import StoreProviders from "@/redux/StoreProviders";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div>
      <main className="">
        <Toaster />
        {children}


      </main>
    </div>


  );
}
