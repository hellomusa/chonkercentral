import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { getAllStudySpots } from '@/lib/db';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Map from "@/components/Map";
import { AppSidebar } from "@/components/spots-sidebar";
import { Suspense } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CU Spots",
  description: "Best spots on campus!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="px-2 pb-2">
                <header className="flex h-16 shrink-0 items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                </header>
                <Map />
              </SidebarInset>
              <ThemeToggle />
            </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}