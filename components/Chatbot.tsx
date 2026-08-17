"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Send,
  Volume2,
  VolumeX,
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
          className={`w-[2px] h-3.5 rounded-full origin-center transition-colors duration-300 ${
            isListening
              ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.9)]"
              : isSpeaking
              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
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
  const [sttSupported, setSttSupported] = useState(true)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const recognitionRef = useRef<any>(null)
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)

  // Auto-scroll on messages change
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      })
    }
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

  // Track virtual keyboard height on mobile to raise ONLY the input box
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return

    const handleViewportChange = () => {
      if (!window.visualViewport) return
      if (window.innerWidth < 640) {
        const winHeight = window.innerHeight
        const visualHeight = window.visualViewport.height
        const diff = Math.max(0, winHeight - visualHeight)
        setKeyboardHeight(diff > 80 ? diff : 0)
        if (diff > 80) {
          setTimeout(() => scrollToBottom(true), 150)
        }
      } else {
        setKeyboardHeight(0)
      }
    }

    const vv = window.visualViewport
    vv.addEventListener("resize", handleViewportChange)
    vv.addEventListener("scroll", handleViewportChange)

    return () => {
      vv.removeEventListener("resize", handleViewportChange)
      vv.removeEventListener("scroll", handleViewportChange)
    }
  }, [scrollToBottom])

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
            }
          }

          recognition.onerror = (event: any) => {
            if (event.error === "no-speech" || event.error === "aborted") {
              // Benign user silence or intentional abort
              setIsListening(false)
              return
            }
            if (event.error === "audio-capture" || event.error === "not-allowed") {
              console.warn(
                "Microphone is unavailable, not connected, or permission was not granted."
              )
            } else {
              console.warn("Speech recognition error:", event.error)
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

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
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
    (rawText: string) => {
      if (
        isMuted ||
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      ) {
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

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
      } catch (err) {
        console.warn("TTS Error:", err)
        setIsSpeaking(false)
      }
    },
    [isMuted]
  )

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // Toggle Microphone (STT)
  const toggleSpeechRecognition = async () => {
    if (!sttSupported || !recognitionRef.current) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome, Edge, or Safari."
      )
      return
    }

    if (isListening) {
      try {
        recognitionRef.current.stop()
      } catch {}
      setIsListening(false)
    } else {
      stopSpeaking()
      try {
        // Check/warm microphone permission if getUserMedia is supported
        if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            stream.getTracks().forEach((track) => track.stop())
          } catch (micErr) {
            console.warn("Microphone access not granted or unavailable:", micErr)
          }
        }
        recognitionRef.current.start()
      } catch (err: any) {
        if (err?.name !== "InvalidStateError") {
          console.warn("Error starting speech recognition:", err)
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

  // Send message and stream response
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim()
    if (!messageContent || isLoading) return

    stopSpeaking()
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      createdAt: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    const assistantId = `assistant-${Date.now()}`
    const assistantPlaceholder: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    }

    setMessages([...updatedMessages, assistantPlaceholder])

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
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
      const decoder = new TextDecoder()
      let accumulatedText = ""

      const contentType = response.headers.get("content-type") || ""
      const isEventStream = contentType.includes("text/event-stream")

      if (!isEventStream) {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break

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
          const { value, done } = await reader.read()
          if (done) break

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

      if (accumulatedText && !isMuted) {
        speakText(accumulatedText)
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Chat generation stopped by user")
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
    }
  }

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsOpen(true)}
                aria-label="Open Gemini Voice Assistant"
                className="relative flex items-center justify-center cursor-pointer select-none group"
              >
                {/* Small Soft Gemini Color Aura around the button */}
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1, 1],
                    opacity: [0.7, 1, 0.7, 0.7],
                  }}
                  transition={{
                    duration: 3.8,
                    times: [0, 0.25, 0.45, 1],
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -inset-1 rounded-full blur-[6px] group-hover:blur-[8px] transition-all duration-300 pointer-events-none"
                  style={{
                    background:
                      "conic-gradient(from 180deg at 50% 50%, #3186FF 0deg, #14BB69 90deg, #F6C013 180deg, #FA4340 270deg, #3186FF 360deg)",
                  }}
                />

                {/* Core #151515 round button without border */}
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#151515] flex items-center justify-center shadow-lg overflow-hidden">
                  {/* Periodic Spin + Enlarge + Pause Animation */}
                  <motion.div
                    animate={{
                      rotate: [0, 180, 360, 360],
                      scale: [1, 1.25, 1, 1],
                    }}
                    transition={{
                      duration: 3.8,
                      times: [0, 0.22, 0.42, 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-5.5 h-5.5 sm:w-6 sm:h-6 flex items-center justify-center pointer-events-none"
                  >
                    <Image
                      src="/skills/gemini.svg"
                      alt="Gemini"
                      width={24}
                      height={24}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </motion.div>
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
            <motion.div
              id="chatbot-window"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 sm:relative pointer-events-auto w-full h-[100dvh] sm:w-[390px] sm:h-[590px] sm:max-h-[660px] flex flex-col rounded-none sm:rounded-[32px] bg-[#0f0f13] sm:bg-[#0f0f13]/95 backdrop-blur-2xl shadow-none sm:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85),0_0_50px_-10px_rgba(49,134,255,0.18)] overflow-hidden font-sans text-zinc-100"
            >
              {/* Animated Gemini Ambient Light Aura (Subtle multi-color glow around the borderless frame) */}
              <div
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
                    <Image
                      src="/skills/gemini.svg"
                      alt="Gemini"
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5 object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-zinc-300 tracking-wide">
                    Shahid's AI assistant
                  </span>
                  {isSpeaking && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Speaking
                    </span>
                  )}
                </div>

                {/* Right: Round Minimal Action Pills */}
                <div className="flex items-center gap-1.5">
                  {/* Voice Output Toggle */}
                  <button
                    onClick={toggleMute}
                    title={isMuted ? "Unmute Voice" : "Mute Voice"}
                    className={`w-7 h-7 rounded-full transition-colors flex items-center justify-center ${
                      isMuted
                        ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60"
                        : "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
                    }`}
                    aria-label={isMuted ? "Unmute Voice" : "Mute Voice"}
                  >
                    {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  </button>

                  {/* New Conversation (+) */}
                  <button
                    onClick={handleResetChat}
                    title="New Conversation"
                    className="w-7 h-7 rounded-full bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
                    aria-label="New Conversation"
                  >
                    <Plus size={14} />
                  </button>

                  {/* Minimize / Down Arrow */}
                  <button
                    onClick={() => setIsOpen(false)}
                    title="Minimize"
                    className="w-7 h-7 rounded-full bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
                    aria-label="Minimize"
                  >
                    <ChevronDown size={14} />
                  </button>

                  {/* Close & Reset Button (X) */}
                  <button
                    onClick={handleCloseAndResetChat}
                    title="Close"
                    className="w-7 h-7 rounded-full bg-zinc-800/60 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors flex items-center justify-center"
                    aria-label="Close and Reset"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Messages Content Stream */}
              <div
                id="chatbot-messages"
                className="relative flex-1 overflow-y-auto overscroll-contain chatbot-scrollbar px-4 py-3 sm:px-5 sm:py-3 space-y-4 scroll-smooth z-10"
              >
                {/* Empty / Welcome State */}
                {messages.length === 0 && (
                  <div className="h-full flex flex-col justify-end space-y-4 pb-2">
                    <div className="space-y-2">
                      <h4 className="text-base font-medium text-white tracking-tight">
                        Hello! Welcome to Shahid's Portfolio.
                      </h4>
                      <p className="text-[13.5px] text-zinc-400 leading-relaxed">
                        I'm his AI assistant powered by Gemini. Ask me about his projects, skills, experience, or hiring him!
                      </p>
                    </div>

                    {/* Minimal Suggestion Chips */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      {INITIAL_SUGGESTIONS.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-left text-xs px-3.5 py-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                        >
                          <span className="truncate">{suggestion}</span>
                          <Send
                            size={12}
                            className="text-zinc-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message List */}
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
                          ) : (
                            <div className="flex items-center gap-1.5 py-1 text-zinc-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                            </div>
                          )}

                          {/* Action Feedback Bar (ThumbsUp, ThumbsDown, Copy, Speaker) */}
                          {message.content && (
                            <div className="flex items-center gap-3 pt-1 text-zinc-400">
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
                                onClick={() => speakText(message.content)}
                                title="Listen aloud"
                                className="text-zinc-500 hover:text-blue-400 transition-colors"
                              >
                                <Volume2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area matching screenshot layout */}
              <div
                style={{
                  paddingBottom:
                    keyboardHeight > 0
                      ? `${keyboardHeight + 6}px`
                      : "max(env(safe-area-inset-bottom), 0.85rem)",
                  transition: "padding-bottom 0.15s ease-out",
                }}
                className="relative px-4 pt-1 sm:px-5 sm:pb-3 select-none z-10"
              >
                {/* Listening Alert Pill */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="mb-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/10 border border-red-500/30 flex items-center justify-between text-xs text-red-300 backdrop-blur-md shadow-lg shadow-red-500/10"
                    >
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                        </span>
                        <span className="font-medium tracking-wide">Listening... Speak now</span>
                      </div>
                      <button
                        onClick={toggleSpeechRecognition}
                        className="px-2.5 py-0.5 rounded-full bg-red-500/30 hover:bg-red-500/50 text-[11px] font-semibold text-white transition-colors"
                      >
                        Done
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Rounded Input Capsule */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#18181d] shadow-inner focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                  <input
                    ref={inputRef}
                    id="chatbot-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => {
                      setTimeout(() => scrollToBottom(true), 200)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isListening ? "Listening..." : "Type a message..."
                    }
                    disabled={isLoading && !isListening}
                    className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 text-[16px] sm:text-[13.5px] focus:outline-none"
                  />

                  {/* Black Circular Waveform / Send Button Pill */}
                  {isLoading ? (
                    <button
                      onClick={handleStopGenerating}
                      title="Stop generating"
                      className="w-8 h-8 rounded-full bg-[#0a0a0d] hover:bg-black text-zinc-300 flex items-center justify-center transition-colors shadow-sm"
                      aria-label="Stop Generating"
                    >
                      <Square size={12} className="fill-current text-zinc-400" />
                    </button>
                  ) : input.trim() ? (
                    <button
                      id="chatbot-send-btn"
                      onClick={() => handleSendMessage()}
                      title="Send message"
                      className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                      aria-label="Send Message"
                    >
                      <Send size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={toggleSpeechRecognition}
                      title={
                        isListening
                          ? "Stop listening"
                          : isSpeaking
                          ? "Speaking"
                          : "Voice Assistant (Click to Speak)"
                      }
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                        isListening
                          ? "bg-red-500/25 ring-2 ring-red-500/70 scale-105"
                          : isSpeaking
                          ? "bg-emerald-500/25 ring-2 ring-emerald-500/70 scale-105"
                          : "bg-[#0a0a0d] hover:bg-zinc-900 hover:scale-105"
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
                    Powered by Gemini 3.6 Flash
                  </span>
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
