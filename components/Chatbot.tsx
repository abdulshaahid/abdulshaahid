"use client"

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

import {
  X,
  Send,
  ArrowUp,
  Volume2,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  Plus,
  ThumbsUp,
  ThumbsDown,
  ArrowUpRight,
  Square,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: Date
  liked?: boolean | null
  stopped?: boolean
}

const INITIAL_SUGGESTIONS = [
  "💼 What is Shahid's work experience?",
  "🚀 Tell me about the Trawayl project",
  "⚡ What are his core technical skills?",
  "📬 How can I contact or hire Shahid?",
]

// Helper to strip markdown for clean speech synthesis
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) -> text
    .replace(/[*#_`~>]/g, "") // remove formatting symbols
    .replace(/```[\s\S]*?```/g, "code block omitted") // code blocks
    .replace(/https?:\/\/\S+/g, "") // URLs
    .replace(/\s+/g, " ")
    .trim()
}

// Simple markdown formatter component for rendering assistant responses
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n")

  return (
    <div className="space-y-2 text-[14px] leading-relaxed text-zinc-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-1" />

        const isBullet =
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ") ||
          /^\d+\.\s/.test(trimmed)
        const bulletText = isBullet
          ? trimmed.replace(/^[-*]\s+|\d+\.\s+/, "")
          : trimmed

        const parsedElements = parseInlineMarkdown(bulletText)

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-blue-400 mt-1 text-xs">•</span>
              <div className="flex-1">{parsedElements}</div>
            </div>
          )
        }

        return <p key={idx}>{parsedElements}</p>
      })}
    </div>
  )
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+)/g
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-zinc-800 text-blue-300 text-xs font-mono"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/)
      if (match) {
        const [, label, url] = match
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors font-medium"
          >
            <span>{label}</span>
            <ArrowUpRight size={11} className="inline" />
          </a>
        )
      }
    }
    if (part.startsWith("http://") || part.startsWith("https://")) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
        >
          <span>{part}</span>
          <ArrowUpRight size={11} className="inline" />
        </a>
      )
    }
    return <span key={index}>{part}</span>
  })
}

// Official Google Gemini vector icon - renders flawlessly on iPhone/Safari and all platforms
function GeminiIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <Image
      src="/skills/gemini.svg"
      alt="Google Gemini"
      width={24}
      height={24}
      className={className}
      priority
    />
  )
}

// Animated soundwave bars with idle breathing and active voice animation
function WaveformBars({
  active = false,
  isListening = false,
  isSpeaking = false,
}: {
  active?: boolean
  isListening?: boolean
  isSpeaking?: boolean
}) {
  const barConfigs = [
    {
      activeValues: [0.3, 1.0, 0.45, 0.85, 0.3],
      idleValues: [0.4, 0.75, 0.4],
      dur: 0.65,
      delay: 0,
    },
    {
      activeValues: [0.6, 0.35, 1.0, 0.5, 0.6],
      idleValues: [0.65, 1.0, 0.65],
      dur: 0.75,
      delay: 0.1,
    },
    {
      activeValues: [0.4, 0.9, 0.3, 0.95, 0.4],
      idleValues: [0.85, 0.5, 0.85],
      dur: 0.6,
      delay: 0.2,
    },
    {
      activeValues: [0.75, 0.4, 0.85, 0.35, 0.75],
      idleValues: [0.5, 0.8, 0.5],
      dur: 0.7,
      delay: 0.15,
    },
  ]

  return (
    <div className="flex items-center justify-center gap-[2.5px] h-4 w-4">
      {barConfigs.map((bar, i) => (
        <motion.span
          key={i}
          animate={{
            scaleY: active ? bar.activeValues : bar.idleValues,
          }}
          transition={{
            duration: active ? bar.dur : 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bar.delay,
          }}
          className={`w-[2px] h-3.5 rounded-full origin-center transition-colors duration-200 ${
            isListening || isSpeaking
              ? "bg-blue-400"
              : "bg-zinc-300"
          }`}
        />
      ))}
    </div>
  )
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null)
  const [sttSupported, setSttSupported] = useState(true)
  const [micError, setMicError] = useState<string | null>(null)
  const [viewportOffset, setViewportOffset] = useState(0)

  const isAtBottomRef = useRef(true)
  const isVoiceInputRef = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const recognitionRef = useRef<any>(null)
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)
  const micErrorTimerRef = useRef<NodeJS.Timeout | null>(null)

  const showMicError = useCallback((message: string) => {
    if (micErrorTimerRef.current) clearTimeout(micErrorTimerRef.current)
    setMicError(message)
    micErrorTimerRef.current = setTimeout(() => {
      setMicError(null)
    }, 4500)
  }, [])

  // Auto-scroll on messages change — uses scrollTop instead of scrollIntoView
  // because scrollIntoView can scroll the visual viewport on mobile, causing
  // the chat to visually jump when the keyboard opens
  const scrollToBottom = useCallback((smooth = true) => {
    const container = document.getElementById('chatbot-messages')
    if (container) {
      isAtBottomRef.current = true
      if (smooth) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
      } else {
        container.scrollTop = container.scrollHeight
      }
    }
  }, [])

  // Track manual scrolling to know if the user is viewing recent messages or reading history
  const handleScroll = useCallback(() => {
    const container = document.getElementById('chatbot-messages')
    if (!container) return
    const atBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <= 45
    isAtBottomRef.current = atBottom
  }, [])

  // Lock background scroll on mobile and desktop when chat is open
  useEffect(() => {
    if (typeof window === "undefined") return

    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"

      return () => {
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        document.body.style.overflow = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // Track visual viewport panning offset across all mobile browsers
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return

    const handleViewportChange = () => {
      if (!window.visualViewport) return
      
      // When the virtual keyboard opens, modern browsers (iOS Safari, Android Chrome) 
      // pan the visual viewport up. visualViewport.offsetTop gives us the EXACT number 
      // of pixels that the layout has been pushed off the top of the visible screen.
      // We track this offset to add a dynamic spacer at the top of the messages, 
      // ensuring the earliest messages are never hidden above the physical screen!
      const offset = window.visualViewport.offsetTop
      setViewportOffset(offset)

      // When the visual viewport resizes or pans during keyboard appearance/dismissal,
      // keep the messages pinned to the bottom if the user is at the bottom.
      if (isAtBottomRef.current) {
        const container = document.getElementById("chatbot-messages")
        if (container) {
          container.scrollTop = container.scrollHeight - container.clientHeight
        }
      }
    }

    const vv = window.visualViewport
    vv.addEventListener("resize", handleViewportChange)
    vv.addEventListener("scroll", handleViewportChange)
    
    handleViewportChange()

    return () => {
      vv.removeEventListener("resize", handleViewportChange)
      vv.removeEventListener("scroll", handleViewportChange)
    }
  }, [])

  // iOS Safari layout detachment prevention:
  // We intercept touchmove events on the scrollable messages container. If the user tries
  // to overscroll (rubber-band) past the top or bottom, we prevent the default behavior.
  // This completely stops Safari from chaining the scroll to the visual viewport,
  // permanently locking the layout without fighting the native keyboard pan!
  useEffect(() => {
    const container = document.getElementById("chatbot-messages")
    if (!container) return

    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!container) return
      
      const touchY = e.touches[0].clientY
      const isSwipingDown = touchY > touchStartY
      const isSwipingUp = touchY < touchStartY
      
      const isAtTop = container.scrollTop <= 0
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 1

      // If at top and swiping down, or at bottom and swiping up, prevent rubber-banding
      if ((isAtTop && isSwipingDown) || (isAtBottom && isSwipingUp)) {
        if (e.cancelable) e.preventDefault()
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isOpen])

  // Initialize Speech Synthesis and Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("speechSynthesis" in window) {
        speechSynthRef.current = window.speechSynthesis
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition()
          recognition.continuous = false
          recognition.interimResults = true
          recognition.lang = "en-US"

          recognition.onstart = () => {
            setIsListening(true)
          }

          recognition.onresult = (event: any) => {
            let currentTranscript = ""
            for (let i = event.resultIndex; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript
            }
            if (currentTranscript) {
              setInput(currentTranscript)
              isVoiceInputRef.current = true
            }
          }

          recognition.onerror = (event: any) => {
            if (event.error === "no-speech") {
              showMicError("No speech detected. Speak closer to the mic.")
              setIsListening(false)
              return
            }
            if (event.error === "aborted") {
              setIsListening(false)
              return
            }
            if (event.error === "audio-capture") {
              showMicError("No microphone found or audio capture failed.")
            } else if (event.error === "not-allowed" || event.error === "permission-denied") {
              showMicError("Microphone blocked. Allow mic access in browser settings.")
            } else if (event.error === "network") {
              showMicError("Speech service network error. Please try again.")
            } else {
              showMicError(`Microphone error: ${event.error || "unavailable"}`)
            }
            setIsListening(false)
          }

          recognition.onend = () => {
            setIsListening(false)
          }

          recognitionRef.current = recognition
        } catch (e) {
          console.warn("Speech recognition initialization failed:", e)
          setSttSupported(false)
        }
      } else {
        setSttSupported(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {}
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  // Mathematically perfect scroll anchoring:
  // When the viewportOffset (top spacer) expands or collapses, it physically pushes the content down or up.
  // If the user was at the bottom, we ensure they stay anchored to the bottom.
  // If the user had manually scrolled up to read earlier history, we compensate by delta so their visual position doesn't jump.
  const prevOffsetRef = useRef(0)
  useIsomorphicLayoutEffect(() => {
    const container = document.getElementById("chatbot-messages")
    if (container) {
      if (isAtBottomRef.current) {
        container.scrollTop = container.scrollHeight - container.clientHeight
      } else {
        const delta = viewportOffset - prevOffsetRef.current
        if (delta !== 0) {
          container.scrollTop += delta
        }
      }
    }
    prevOffsetRef.current = viewportOffset
  }, [viewportOffset])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      isAtBottomRef.current = true
      setTimeout(() => {
        inputRef.current?.focus()
        scrollToBottom(false)
      }, 150)
    } else {
      stopSpeaking()
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop()
      }
    }
  }, [isOpen, scrollToBottom, isListening])

  // Text to Speech playback function
  const speakText = useCallback(
    (rawText: string, messageId?: string) => {
      if (
        isMuted ||
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      ) {
        return
      }

      // If currently speaking this exact message, clicking speaker stops it
      if (window.speechSynthesis.speaking && messageId && speakingMessageId === messageId) {
        stopSpeaking()
        return
      }

      const cleanText = cleanTextForSpeech(rawText)
      if (!cleanText) return

      try {
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.rate = 1.05
        utterance.pitch = 1.0

        const voices = window.speechSynthesis.getVoices()
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Google") ||
                v.name.includes("Natural") ||
                v.name.includes("Samantha") ||
                v.name.includes("Daniel") ||
                v.name.includes("Premium"))
          ) || voices.find((v) => v.lang.startsWith("en"))

        if (preferredVoice) {
          utterance.voice = preferredVoice
        }

        utterance.onstart = () => {
          setIsSpeaking(true)
          if (messageId) setSpeakingMessageId(messageId)
        }
        utterance.onend = () => {
          setIsSpeaking(false)
          setSpeakingMessageId(null)
        }
        utterance.onerror = () => {
          setIsSpeaking(false)
          setSpeakingMessageId(null)
        }

        window.speechSynthesis.speak(utterance)
      } catch (err) {
        console.warn("TTS Error:", err)
        setIsSpeaking(false)
        setSpeakingMessageId(null)
      }
    },
    [isMuted, speakingMessageId]
  )

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setSpeakingMessageId(null)
    }
  }, [])

  // Toggle Microphone (STT)
  const toggleSpeechRecognition = async () => {
    if (isLoading) return // Block recording while response is processing

    if (!sttSupported || !recognitionRef.current) {
      showMicError("Voice input is not supported in this browser. Use Chrome or Safari.")
      return
    }

    if (isListening) {
      try {
        recognitionRef.current.stop()
      } catch {}
      setIsListening(false)
    } else {
      stopSpeaking()
      setMicError(null)
      isVoiceInputRef.current = true
      try {
        // Check/warm microphone permission if getUserMedia is supported
        if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            stream.getTracks().forEach((track) => track.stop())
          } catch (micErr: any) {
            if (micErr?.name === "NotAllowedError" || micErr?.name === "PermissionDeniedError") {
              showMicError("Microphone permission blocked. Please allow mic access.")
              setIsListening(false)
              return
            } else if (micErr?.name === "NotFoundError" || micErr?.name === "DevicesNotFoundError") {
              showMicError("No microphone hardware found on your device.")
              setIsListening(false)
              return
            }
          }
        }
        recognitionRef.current.start()
      } catch (err: any) {
        if (err?.name !== "InvalidStateError") {
          showMicError("Failed to start voice input. Please try again.")
        }
        setIsListening(false)
      }
    }
  }

  // Toggle Mute (TTS)
  const toggleMute = () => {
    if (!isMuted) {
      stopSpeaking()
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // Clear chat
  const handleResetChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    stopSpeaking()
    isVoiceInputRef.current = false
    setMessages([])
    setIsLoading(false)
  }

  // Close modal and reset conversation
  const handleCloseAndResetChat = () => {
    handleResetChat()
    setIsOpen(false)
  }

  // Like / Dislike message
  const handleFeedback = (id: string, liked: boolean) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, liked: m.liked === liked ? null : liked } : m
      )
    )
  }

  // Copy message text
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Regenerate response in-place
  const handleRegenerate = (assistantId: string) => {
    if (isLoading) return
    const msgIndex = messages.findIndex((m) => m.id === assistantId)
    if (msgIndex >= 0) {
      let prevUserPrompt = ""
      for (let i = msgIndex - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          prevUserPrompt = messages[i].content
          break
        }
      }
      if (prevUserPrompt) {
        handleSendMessage(prevUserPrompt, assistantId, false)
      }
    }
  }

  // Send message and stream response (or retry in-place if retryAssistantId is provided)
  const handleSendMessage = async (
    textToSend?: string,
    retryAssistantId?: string,
    isVoice?: boolean
  ) => {
    const messageContent = (textToSend || input).trim()
    if (!messageContent || isLoading) return

    const shouldSpeak = isVoice !== undefined ? isVoice : isVoiceInputRef.current
    isVoiceInputRef.current = false

    stopSpeaking()
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}
    }

    let contextMessages: Message[]
    let assistantId: string

    if (retryAssistantId) {
      assistantId = retryAssistantId
      const msgIndex = messages.findIndex((m) => m.id === retryAssistantId)
      if (msgIndex >= 0) {
        // AI context includes everything up to the preceding user message
        contextMessages = messages.slice(0, msgIndex)
        // Reset that specific message in place
        setMessages((prev) =>
          prev.map((m) =>
            m.id === retryAssistantId
              ? { ...m, content: "", stopped: false, liked: null }
              : m
          )
        )
      } else {
        return
      }
    } else {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: messageContent,
        createdAt: new Date(),
      }

      contextMessages = [...messages, userMessage]
      setInput("")
      assistantId = `assistant-${Date.now()}`
      const assistantPlaceholder: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date(),
      }

      setMessages([...contextMessages, assistantPlaceholder])
    }

    setIsLoading(true)

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: contextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error("No response body received")
      }

      const reader = response.body.getReader()
      readerRef.current = reader
      const decoder = new TextDecoder()
      let accumulatedText = ""

      const contentType = response.headers.get("content-type") || ""
      const isEventStream = contentType.includes("text/event-stream")

      try {
        if (!isEventStream) {
          while (true) {
            if (abortController.signal.aborted) break
            const { value, done } = await reader.read()
            if (done || abortController.signal.aborted) break

            const textChunk = decoder.decode(value, { stream: true })
            accumulatedText += textChunk

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, content: accumulatedText }
                  : msg
              )
            )
          }
        } else {
          let buffer = ""
          while (true) {
            if (abortController.signal.aborted) break
            const { value, done } = await reader.read()
            if (done || abortController.signal.aborted) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed) continue

              if (trimmed.startsWith("0:")) {
                try {
                  const parsed = JSON.parse(trimmed.slice(2))
                  if (typeof parsed === "string") {
                    accumulatedText += parsed
                  } else if (parsed && typeof parsed.text === "string") {
                    accumulatedText += parsed.text
                  } else if (parsed && typeof parsed.delta === "string") {
                    accumulatedText += parsed.delta
                  }
                } catch {
                  accumulatedText += trimmed.slice(2)
                }
              } else if (trimmed.startsWith("data:")) {
                const dataStr = trimmed.slice(5).trim()
                if (dataStr === "[DONE]") continue
                try {
                  const parsed = JSON.parse(dataStr)
                  if (typeof parsed === "string") {
                    accumulatedText += parsed
                  } else if (parsed && typeof parsed.text === "string") {
                    accumulatedText += parsed.text
                  } else if (parsed && typeof parsed.delta === "string") {
                    accumulatedText += parsed.delta
                  }
                } catch {
                  accumulatedText += dataStr
                }
              }
            }

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, content: accumulatedText }
                  : msg
              )
            )
          }
        }

        if (accumulatedText && shouldSpeak && !isMuted && !abortController.signal.aborted) {
          speakText(accumulatedText, assistantId)
        }
      } finally {
        readerRef.current = null
      }
    } catch (err: any) {
      if (err?.name === "AbortError" || abortController.signal.aborted) {
        console.log("Chat generation stopped by user")
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, stopped: true } : msg
          )
        )
      } else {
        console.error("Chat error:", err)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content:
                    "Sorry, I encountered an issue connecting to Gemini. Please try again in a moment.",
                }
              : msg
          )
        )
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
      readerRef.current = null
    }
  }

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort()
      } catch {}
      abortControllerRef.current = null
    }
    if (readerRef.current) {
      try {
        readerRef.current.cancel()
      } catch {}
      readerRef.current = null
    }
    stopSpeaking()
    setIsLoading(false)

    setMessages((prev) => {
      if (prev.length === 0) return prev
      const lastIndex = prev.length - 1
      if (prev[lastIndex].role === "assistant") {
        return prev.map((m, idx) =>
          idx === lastIndex ? { ...m, stopped: true } : m
        )
      }
      return prev
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim()) {
        handleSendMessage()
      }
    }
  }

  return (
    <>
      {/* Floating Gemini Toggle Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <div className="relative group flex items-center">
              {/* Hover Tooltip Label */}
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                whileHover={{ opacity: 1, x: 0, scale: 1 }}
                className="hidden sm:group-hover:flex absolute right-full mr-3 items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/90 text-zinc-200 text-xs font-medium shadow-2xl backdrop-blur-md whitespace-nowrap pointer-events-none transition-all duration-200"
              >
                <span>Ask Shahid's AI assistant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              </motion.div>

              <motion.button
                id="chatbot-open-btn"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setIsOpen(true)}
                aria-label="Open Gemini Voice Assistant"
                className="relative flex items-center justify-center cursor-pointer select-none group"
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
              >
                {/* Small Soft Gemini Color Aura around the button (GPU Composited) */}
                <div
                  className="absolute -inset-1 rounded-full blur-[6px] group-hover:blur-[8px] transition-[filter] duration-300 pointer-events-none"
                  style={{
                    background:
                      "conic-gradient(from 180deg at 50% 50%, #3186FF 0deg, #14BB69 90deg, #F6C013 180deg, #FA4340 270deg, #3186FF 360deg)",
                    animation: "chatbotAura 3.8s ease-in-out infinite",
                    willChange: "transform, opacity",
                  }}
                />

                {/* Core #151515 round button without border */}
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#151515] flex items-center justify-center shadow-lg overflow-hidden">
                  {/* Periodic Spin + Enlarge + Pause Animation (GPU Composited) */}
                  <div
                    className="w-5.5 h-5.5 sm:w-6 sm:h-6 flex items-center justify-center pointer-events-none"
                    style={{
                      animation: "chatbotSpin 3.8s ease-in-out infinite",
                      willChange: "transform",
                    }}
                  >
                    <GeminiIcon className="w-full h-full object-contain" />
                  </div>
                </div>
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Redesigned Clean, Borderless Dark Chat Window Modal with Gemini Ambient Lights */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[390px]">
            {/* Mobile Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] sm:hidden pointer-events-auto z-0"
            />

            <motion.div
              id="chatbot-window"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
              className="fixed inset-0 sm:relative pointer-events-auto w-full h-[100dvh] sm:w-[390px] sm:h-[590px] sm:max-h-[660px] flex flex-col rounded-none sm:rounded-[32px] bg-[#0f0f13] sm:bg-[#0f0f13]/95 backdrop-blur-2xl shadow-none sm:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85),0_0_50px_-10px_rgba(49,134,255,0.18)] overflow-hidden font-sans text-zinc-100 origin-bottom sm:origin-bottom-right z-10 touch-none sm:touch-auto"
            >
              {/* Animated Gemini Ambient Light Aura (Subtle multi-color glow around the borderless frame) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-10 rounded-[45px] opacity-35 blur-3xl pointer-events-none animate-pulse"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(49,134,255,0.3) 0%, rgba(139,92,246,0.2) 35%, rgba(250,67,64,0.18) 70%, transparent 85%)",
                }}
              />

              {/* Top Minimalist Header */}
              <div className="relative px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-2 sm:px-5 sm:pt-4 sm:pb-2 flex items-center justify-between select-none z-10">
                {/* Left: Subtle branding */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1c1c22] flex items-center justify-center shadow-xs">
                    <GeminiIcon className="w-3.5 h-3.5 object-contain" />
                  </div>
                  <span className="text-xs font-medium text-zinc-300 tracking-wide">
                    Shahid's AI assistant
                  </span>
                  {isSpeaking && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                      Speaking
                    </span>
                  )}
                </div>

                {/* Right: Round Minimal Action Pills */}
                <div className="flex items-center gap-1.5">
                  {/* New Conversation (+) */}
                  <button
                    onClick={handleResetChat}
                    title="New Conversation"
                    className="w-7 h-7 rounded-full bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="New Conversation"
                  >
                    <Plus size={14} />
                  </button>

                  {/* Minimize / Down Arrow */}
                  <button
                    onClick={() => setIsOpen(false)}
                    title="Minimize"
                    className="w-7 h-7 rounded-full bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Minimize"
                  >
                    <ChevronDown size={14} />
                  </button>

                  {/* Close & Reset Button (X) */}
                  <button
                    onClick={handleCloseAndResetChat}
                    title="Close"
                    className="w-7 h-7 rounded-full bg-zinc-800/60 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Close and Reset"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Messages Content Stream */}
              <div
                id="chatbot-messages"
                onScroll={handleScroll}
                className="relative flex-1 overflow-y-auto overscroll-none touch-pan-y chatbot-scrollbar px-4 py-3 sm:px-5 sm:py-3 z-10"
              >
                {/* Safe inner wrapper: separates scrolling from flexbox bottom-alignment to prevent top-clipping */}
                <div className="flex flex-col min-h-full">
                  {/* Spacer pushes short content to the bottom, but collapses when content overflows */}
                  <div className="flex-1 shrink-0" />

                  {/* Top spacer for keyboard pan: ensures the top-most messages can be scrolled into view when visual viewport is panned */}
                  {viewportOffset > 0 && (
                    <div
                      style={{ height: `${viewportOffset}px` }}
                      className="shrink-0 w-full pointer-events-none"
                      aria-hidden="true"
                    />
                  )}

                  {/* Empty / Welcome State */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                    className="flex flex-col space-y-4 pb-2"
                  >
                    <div className="space-y-2">
                      <h4 className="text-base font-medium text-white tracking-tight">
                        Hello! Welcome to Shahid's Portfolio.
                      </h4>
                      <p className="text-[13.5px] text-zinc-400 leading-relaxed">
                        I'm his AI assistant powered by Gemini. Ask me about his projects, skills, experience, or hiring him!
                      </p>
                    </div>

                    {/* Minimal Suggestion Chips with smooth staggered cascade */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.04, delayChildren: 0.08 },
                        },
                      }}
                      className="flex flex-col gap-1.5 pt-1"
                    >
                      {INITIAL_SUGGESTIONS.map((suggestion, i) => (
                        <motion.button
                          key={i}
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                            },
                          }}
                          disabled={isLoading}
                          onClick={() => handleSendMessage(suggestion, undefined, false)}
                          className="text-left text-xs px-3.5 py-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
                        >
                          <span className="truncate">{suggestion}</span>
                          <ArrowUp
                            size={12}
                            className="text-zinc-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2 rotate-45"
                          />
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* Message List */}
                {messages.length > 0 && (
                  <div className="w-full space-y-4">
                    {messages.map((message) => {
                      const isUser = message.role === "user"

                      return (
                        <div
                          key={message.id}
                          className={`flex flex-col ${
                            isUser ? "items-end" : "items-start"
                          } space-y-1.5`}
                        >
                          {/* User message: clean soft pill */}
                          {isUser ? (
                            <div className="bg-[#242429] text-zinc-100 rounded-2xl rounded-tr-xs px-4 py-2 text-[13.5px] max-w-[82%] shadow-xs leading-relaxed">
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                          ) : (
                            /* Assistant message: borderless natural text matching screenshot */
                            <div className="w-full space-y-2 text-zinc-200 text-[14px]">
                              {message.content ? (
                                <MarkdownContent content={message.content} />
                              ) : !message.stopped ? (
                                <div className="flex items-center gap-1.5 py-1 text-zinc-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                                </div>
                              ) : null}

                              {/* "You stopped this response" Indicator matching screenshot */}
                              {message.stopped && (
                                <div className="w-full flex items-center gap-3 my-2.5 text-xs text-zinc-500 select-none">
                                  <div className="flex-1 h-[1px] bg-zinc-800" />
                                  <span className="text-[12px] font-normal text-zinc-400 whitespace-nowrap">
                                    You stopped this response
                                  </span>
                                  <div className="flex-1 h-[1px] bg-zinc-800" />
                                </div>
                              )}

                              {/* Action Feedback Bar (Regenerate, ThumbsUp, ThumbsDown, Copy, Speaker) */}
                              {(message.content || message.stopped) && (
                                <div className="flex items-center gap-3 pt-0.5 text-zinc-400">
                                  {/* Regenerate / Retry button */}
                                  <button
                                    onClick={() => handleRegenerate(message.id)}
                                    disabled={isLoading}
                                    title="Regenerate response"
                                    className="text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-40 cursor-pointer"
                                  >
                                    <RotateCcw size={13.5} />
                                  </button>

                                  {message.content && (
                                    <>
                                      {/* Thumbs Up */}
                                      <button
                                        onClick={() => handleFeedback(message.id, true)}
                                        title="Helpful"
                                        className={`transition-colors hover:text-zinc-200 ${
                                          message.liked === true
                                            ? "text-blue-400"
                                            : "text-zinc-500"
                                        }`}
                                      >
                                        <ThumbsUp size={14} className={message.liked === true ? "fill-current" : ""} />
                                      </button>

                                      {/* Thumbs Down */}
                                      <button
                                        onClick={() => handleFeedback(message.id, false)}
                                        title="Not helpful"
                                        className={`transition-colors hover:text-zinc-200 ${
                                          message.liked === false
                                            ? "text-red-400"
                                            : "text-zinc-500"
                                        }`}
                                      >
                                        <ThumbsDown size={14} className={message.liked === false ? "fill-current" : ""} />
                                      </button>

                                      {/* Copy Message */}
                                      <button
                                        onClick={() =>
                                          handleCopyMessage(message.id, message.content)
                                        }
                                        title="Copy response"
                                        className="text-zinc-500 hover:text-zinc-200 transition-colors"
                                      >
                                        {copiedId === message.id ? (
                                          <Check size={14} className="text-emerald-400" />
                                        ) : (
                                          <Copy size={14} />
                                        )}
                                      </button>

                                      {/* Speak text */}
                                      <button
                                        onClick={() => speakText(message.content, message.id)}
                                        title={speakingMessageId === message.id ? "Stop listening" : "Listen aloud"}
                                        className={`transition-colors cursor-pointer ${
                                          speakingMessageId === message.id
                                            ? "text-blue-400"
                                            : "text-zinc-500 hover:text-blue-400"
                                        }`}
                                      >
                                        <Volume2 size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}

                    <div ref={messagesEndRef} />
                  </div>
                )}
                </div>
              </div>

              <div
                style={{
                  paddingBottom: "max(env(safe-area-inset-bottom), 0.85rem)",
                }}
                className="relative px-4 pt-1 sm:px-5 sm:pb-3 select-none z-10"
              >
                {/* Listening Alert Pill & Mic Error Indicator Pill - Clean Borderless Gemini Design */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      key="listening-pill"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="mb-2 px-3.5 py-1.5 rounded-full bg-[#1e1e24] flex items-center justify-between text-xs text-zinc-300 select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[12px] text-zinc-300 font-normal">Listening... Speak now</span>
                      </div>
                      <button
                        onClick={toggleSpeechRecognition}
                        className="text-[11px] text-zinc-400 hover:text-white transition-colors font-medium ml-3 cursor-pointer"
                      >
                        Done
                      </button>
                    </motion.div>
                  )}

                  {micError && (
                    <motion.div
                      key="mic-error-pill"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="mb-2 px-3.5 py-1.5 rounded-full bg-[#1e1e24] flex items-center justify-between text-xs text-zinc-300 select-none"
                    >
                      <div className="flex items-center gap-2 truncate mr-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                        <span className="text-[12px] text-zinc-300 font-normal truncate">
                          {micError}
                        </span>
                      </div>
                      <button
                        onClick={() => setMicError(null)}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 cursor-pointer"
                        title="Dismiss"
                        aria-label="Dismiss error"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Rounded Input Capsule */}
                <div className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-[#18181d] shadow-inner focus-within:ring-1 focus-within:ring-gray-500/30 transition-all">
                  <input
                    ref={inputRef}
                    id="chatbot-input"
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      isVoiceInputRef.current = false
                    }}
                    onClick={(e) => {
                      // Safari edge case fix: If the keyboard was manually closed but the input 
                      // remains technically focused, tapping it again won't pan the screen up.
                      // We detect if it's tapped while already focused AND the keyboard is closed 
                      // (visualViewport is full height). If so, we force a quick blur/focus cycle 
                      // so Safari natively pans it.
                      if (window.innerWidth < 640 && document.activeElement === inputRef.current) {
                        const vv = window.visualViewport
                        if (vv && Math.abs(window.innerHeight - vv.height) < 80) {
                          inputRef.current?.blur()
                          setTimeout(() => inputRef.current?.focus(), 10)
                        }
                      }
                    }}
                    onFocus={() => {
                      isAtBottomRef.current = true
                      setTimeout(() => scrollToBottom(true), 200)
                    }}
                    onBlur={() => {
                      if (isAtBottomRef.current) {
                        const container = document.getElementById("chatbot-messages")
                        if (container) {
                          container.scrollTop = container.scrollHeight - container.clientHeight
                        }
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isLoading
                        ? "Generating response..."
                        : isListening
                        ? "Listening..."
                        : "Type a message..."
                    }
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 text-[16px] sm:text-[13.5px] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed py-1"
                  />

                  {/* Action Button: While processing, ONLY show Stop button */}
                  {isLoading ? (
                    <button
                      id="chatbot-stop-btn"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleStopGenerating()
                      }}
                      title="Stop generating"
                      className="w-8 h-8 shrink-0 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                      aria-label="Stop Generating"
                    >
                      <Square size={11} className="fill-current text-zinc-200" />
                    </button>
                  ) : input.trim() ? (
                    <button
                      id="chatbot-send-btn"
                      type="button"
                      onClick={() => handleSendMessage()}
                      title="Send message"
                      className="w-8 h-8 shrink-0 rounded-full bg-[#2563eb]/70 hover:bg-[#2563eb]/60 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                      aria-label="Send Message"
                    >
                      <ArrowUp size={17} strokeWidth={2.4} className="text-white" />
                    </button>
                  ) : (
                    <button
                      onClick={toggleSpeechRecognition}
                      type="button"
                      title={
                        isListening
                          ? "Stop listening"
                          : isSpeaking
                          ? "Speaking"
                          : "Voice Assistant (Click to Speak)"
                      }
                      className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all ${
                        isListening || isSpeaking
                          ? "bg-[#282830] text-white scale-105"
                          : "bg-[#0a0a0d] hover:bg-zinc-900 hover:scale-105 cursor-pointer"
                      }`}
                      aria-label="Voice Waveform"
                    >
                      <WaveformBars
                        active={isListening || isSpeaking}
                        isListening={isListening}
                        isSpeaking={isSpeaking}
                      />
                    </button>
                  )}
                </div>

                {/* Subtle Centered Footer Note */}
                <div className="text-center mt-2">
                  <span className="text-[10.5px] font-sans text-zinc-500 font-normal tracking-tight">
Crafted by Shahid ✧ Gemini                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot
