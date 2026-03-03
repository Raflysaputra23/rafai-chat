import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
});

const inter = Inter({
  weight: ["300", "600"],
  variable: "--font-inter",
})


export const metadata: Metadata = {
  title: {
    default: "RafAI | Platform API Chatbot AI Cerdas",
    template: "%s | RafAI"
  },
  description: "RafAI adalah asisten chatbot AI yang cerdas dan inovatif, dikembangkan oleh Rafly. Dapatkan API Key untuk integrasi mudah dan mulai kembangkan AI Anda sendiri!",
  authors: [
    {
      name: "Rafly",
      url: "https://rafly-portofolio.vercel.app/",
    },
  ],
  keywords: [
    "RafAI", "chatbot AI", "API Chatbot", "AI Canggih", "Asisten AI",
    "Next.js AI", "Rafly AI", "Pengembangan AI", "API Key Chatbot",
    "Custom Chatbot", "Integrasi AI", "Bot AI", "Platform AI"
  ],
  openGraph: {
    title: "RafAI: Platform API Chatbot AI Cerdas",
    description: "Kembangkan aplikasi AI Anda dengan mudah! RafAI menyediakan API Chatbot AI yang canggih dan siap pakai. Dapatkan API Key Anda sekarang!",
    url: process.env.NEXT_PUBLIC_URL_DOMAIN, 
    siteName: "RafAI", 
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL_DOMAIN}/rafai-logo.png`, 
        width: 800,
        height: 600,
        alt: "RafAI Chatbot AI Logo",
      },
    ],
    locale: "id_ID", 
    type: "website",
  },
   robots: {
    index: true,
    follow: true, 
    nocache: true, 
    googleBot: { 
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${inter.variable} overflow-x-hidden overflow-y-auto`}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
