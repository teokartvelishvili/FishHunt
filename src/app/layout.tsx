import "./globals.css";
import Header from "../components/header/header";
import Footer from "../components/footer/footer"
import { LanguageProvider } from "@/hooks/LanguageContext";
// import Footer from '@/components/Footer/Footer';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
