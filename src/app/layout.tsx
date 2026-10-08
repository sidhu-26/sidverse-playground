import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, Orbitron, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { OSProvider } from "../lib/context/OSContext";
import { AppShell } from "../components/layout/AppShell";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SID//OS — Personal Command Center",
  description: "Futuristic personal operating system and mission control productivity suite.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${orbitron.variable} ${ibmPlexMono.variable} dark`}
    >
      <body className="bg-[#07090D] text-[#F4F7FA] font-sans antialiased min-h-screen selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
        <Suspense fallback={<div className="min-h-screen bg-[#07090D]" />}>
          <OSProvider>
            <AppShell>{children}</AppShell>
          </OSProvider>
        </Suspense>
      </body>
    </html>
  );
}
