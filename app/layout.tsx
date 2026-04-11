import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediTrack+ | Smart Hospital Navigation",
  description: "Real-time hospital availability & AI-powered emergency routing system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
        />
      </body>
    </html>
  );
}