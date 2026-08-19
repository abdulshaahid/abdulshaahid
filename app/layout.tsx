import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans, Bricolage_Grotesque, Instrument_Serif } from "next/font/google"
import { ChatbotClient } from "@/components/chatbot-client"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
})
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
})
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "Mohamed Abdul Shahid — Portfolio",
  description: "React Frontend Developer & UI/UX Designer",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} ${bricolage.variable} ${instrumentSerif.variable} antialiased scroll-smooth`}
    >
      <head>
        <link rel="preload" href="/head.webp" as="image" type="image/webp" fetchPriority="high" />
      </head>
      <body className="bg-black text-white font-sans">
        {children}
        <ChatbotClient />
      </body>
    </html>
  )
}
