import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
// import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/modules/cart/context/cart-context";
import { CheckoutProvider } from "@/modules/checkout/context/checkout-context";
import { satoshi } from "./(pages)/fonts";
import Header from "@/components/Header/header";
import Footer from "@/components/footer/footer";
import { LanguageProvider } from "@/hooks/LanguageContext";

export const metadata: Metadata = {
  title: "FishHunt",
  description: "ECommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <AuthProvider>
            <CartProvider>
              <CheckoutProvider>
                <LanguageProvider>
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </LanguageProvider>
              </CheckoutProvider>
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

// "use client"; // Ensure the file is treated as a client-side component

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { CartProvider } from "@/modules/cart/context/cart-context";
// import { LanguageProvider } from "@/hooks/LanguageContext";
// import Header from "@/components/Header/header";
// import Footer from "@/components/footer/footer";
// import { usePathname } from "next/navigation";
// import "./globals.css";

// interface RootLayoutProps {
//   children: React.ReactNode;
// }

// const queryClient = new QueryClient();

// export default function RootLayout({ children }: RootLayoutProps) {
//   const pathname = usePathname();

//   // გვერდები, რომლებზეც არ გვინდა Header და Footer გამოჩნდეს
//   const authRoutes = ["/login", "/register"];
//   const isAuthPage = authRoutes.includes(pathname);

//   return (
//     <html lang="en">
//       <body>
//         <QueryClientProvider client={queryClient}>
//           <CartProvider>
//             <LanguageProvider>
//               {!isAuthPage && <Header />}
//               <main>{children}</main>
//               {!isAuthPage && <Footer />}
//             </LanguageProvider>
//           </CartProvider>
//         </QueryClientProvider>
//       </body>
//     </html>
//   );
// }
