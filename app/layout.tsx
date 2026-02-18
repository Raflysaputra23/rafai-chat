import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
});

const inter = Inter({
  weight: ["300","600"],
  variable: "--font-inter",
})


export const metadata: Metadata = {
  title: "Raf Dashboard",
  description: "Aplikasi manajemen rafai, tools untuk membuat AI canggih",
  authors: [
    {
      name: "Rafly",
      url: "https://rafly-portofolio.vercel.app/",
    },
  ],
  openGraph: {
    title: "Raf Dashboard",
    description: "Aplikasi manajemen rafai, tools untuk membuat AI canggih",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${inter.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
