import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { PageTransition } from "@/components/page-transition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Juguetería ITGAM - Admin",
  description: "Panel de administración de la Juguetería ITGAM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar lateral */}
          <Sidebar />

          {/* Zona principal */}
          <div className="flex min-h-screen flex-1 flex-col bg-slate-50">
            {/* Topbar */}
            <header className="flex h-16 items-center border-b border-slate-200 bg-white px-4 md:px-6">
              <h1 className="text-base font-semibold text-slate-800 md:text-lg">
                Panel de administración · Juguetería ITGAM
              </h1>
            </header>

            {/* Contenido con transición */}
            <main className="flex-1 px-4 py-6 md:px-8">
              <div className="mx-auto max-w-6xl h-full">
                <PageTransition>{children}</PageTransition>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
