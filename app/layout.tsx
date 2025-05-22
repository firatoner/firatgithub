import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/important/theme-provider";
import { ThemeToggle } from "@/components/important/ThemeToggle";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageSelector from "@/components/important/LanguageSelector";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PortfoyPro",
  description: "Finansal portföy yönetim uygulaması",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <div className="fixed top-4 right-4  flex gap-6 items-center">
              <ThemeToggle />
              <LanguageSelector />
            </div>
            <UserProvider>{children}</UserProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
