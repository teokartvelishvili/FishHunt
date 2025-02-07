"use client"; // Ensure the file is treated as a client-side component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/modules/cart/context/cart-context";
import { LanguageProvider } from "@/hooks/LanguageContext";
import Header from "@/components/Header/header";
import Footer from "@/components/footer/footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <LanguageProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </LanguageProvider>
          </CartProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
