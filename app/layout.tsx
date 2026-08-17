import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Sora, Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google"
import { Chatbot } from "@/components/Chatbot"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})
const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
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


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
}

export const metadata: Metadata = {
  title: "Mohamed Abdul Shahid — Portfolio",
  description: "React Frontend Developer & UI/UX Designer",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${jakarta.variable} ${bricolage.variable} antialiased scroll-smooth`}>
      <body className="bg-black text-white font-sans">
        {children}
        <Chatbot />
      </body>
    </html>
  )
}
