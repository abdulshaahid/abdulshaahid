import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import { SYSTEM_PROMPT } from "@/lib/system-prompt"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Format messages cleanly for streamText
    const formattedMessages = Array.isArray(messages)
      ? messages.map((m: any) => {
          let textContent = ""
          if (typeof m.content === "string") {
            textContent = m.content
          } else if (Array.isArray(m.parts)) {
            textContent = m.parts
              .filter((p: any) => p.type === "text" && typeof p.text === "string")
              .map((p: any) => p.text)
              .join("\n")
          } else if (m.text) {
            textContent = m.text
          }

          return {
            role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
            content: textContent || "Hello",
          }
        })
      : []

    // Keep last 10 messages for high speed and relevance
    const recentMessages = formattedMessages.slice(-10)

    const result = streamText({
      model: google("gemini-3.6-flash"),
      system: SYSTEM_PROMPT,
      messages: recentMessages,
      maxOutputTokens: 600,
      temperature: 0.5,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingLevel: "minimal",
          },
        },
      },
    })

    // Return text stream response consumed by custom fetch reader in client
    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error("Error in chat route:", error)
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}