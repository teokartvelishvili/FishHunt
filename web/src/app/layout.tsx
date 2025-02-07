"use client"; // Ensure the file is treated as a client-side component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/modules/cart/context/cart-context";
import { LanguageProvider } from "@/hooks/LanguageContext";
import Header from "@/components/Header/header";
import Footer from "@/components/footer/footer";
import { usePathname } from "next/navigation";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();

  // გვერდები, რომლებზეც არ გვინდა Header და Footer გამოჩნდეს
  const authRoutes = ["/login", "/register"];
  const isAuthPage = authRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <LanguageProvider>
              {!isAuthPage && <Header />}
              <main>{children}</main>
              {!isAuthPage && <Footer />}
            </LanguageProvider>
          </CartProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
