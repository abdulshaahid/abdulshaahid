import { NextResponse } from "next/server"

export async function POST() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured in environment variables" },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/tokens?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ttl: "300s",
        }),
      }
    )

    if (!response.ok) {
      return NextResponse.json({ token: apiKey })
    }

    const data = await response.json()
    const token = data.name || data.token || apiKey
    return NextResponse.json({ token })
  } catch (error: any) {
    return NextResponse.json({ token: apiKey })
  }
}
