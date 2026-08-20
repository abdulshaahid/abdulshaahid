"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

const Chatbot = dynamic(() => import("@/components/Chatbot").then((mod) => mod.Chatbot), {
  ssr: false,
})

export function ChatbotClient() {
  const pathname = usePathname()

  // Hide chatbot on 404 and non-root pages
  if (pathname !== "/") {
    return null
  }

  return <Chatbot />
}

