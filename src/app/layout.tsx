import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from "@/lib/error-tracking";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
  title: "MoodScope - Music Mood Analysis",
  description: "Analyze the mood and energy of your Spotify playlists with AI-powered insights and beautiful visualizations",
  keywords: "music, mood, spotify, playlist, analysis, AI, visualization",
  authors: [{ name: "MoodScope Team" }],
  openGraph: {
    title: "MoodScope - Music Mood Analysis",
    description: "Analyze the mood and energy of your Spotify playlists with AI-powered insights",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
