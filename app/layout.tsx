import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BIOscope - Virtual Lab",
  description: "Developed by Crescentia Laura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}
      >
        {/* Konten Utama Aplikasi dengan padding bawah agar tidak tertutup credit */}
        <main className="pb-16">
          {children}
        </main>

        {/* --- GLOBAL CREDIT SECTION (ALWAYS VISIBLE) --- */}
        <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full text-center z-50 pointer-events-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
            © Crescentia Laura 2026
          </p>
        </footer>
      </body>
    </html>
  );
}