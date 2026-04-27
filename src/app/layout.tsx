import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ServiceWorkerProvider } from "@/components/providers/sw-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Carevia — B2B Healthcare SaaS",
  description:
    "A modern healthcare platform for clinics: patient management, analytics, and real-time alerts.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a5cf0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <AuthProvider>
          <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
