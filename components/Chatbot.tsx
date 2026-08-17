"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Send,
  Mic,
  MicOff,
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
  PhoneOff,
  Radio,
  MessageSquare,
} from "lucide-react"
import { SYSTEM_PROMPT } from "@/lib/system-prompt"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: Date
  liked?: boolean | null
}

type LiveState = "idle" | "connecting" | "listening" | "speaking" | "error"

const AVAILABLE_VOICES = [
  { name: "Puck", label: "Puck (Energetic)" },
  { name: "Charon", label: "Charon (Calm)" },
  { name: "Kore", label: "Kore (Warm)" },
  { name: "Fenrir", label: "Fenrir (Deep)" },
  { name: "Aoede", label: "Aoede (Expressive)" },
]

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

// Waveform sound animation bars
function WaveformBars({ active = false }: { active?: boolean }) {
  return (
    <div className="flex items-center gap-[2.5px] h-4">
      {[0.4, 0.8, 1, 0.6, 0.9].map((height, i) => (
        <motion.span
          key={i}
          animate={
            active
              ? {
                  scaleY: [0.3, 1, 0.4, 0.9, 0.3],
                }
              : { scaleY: height }
          }
          transition={
            active
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.12,
                }
              : { duration: 0.2 }
          }
          className="w-[2.5px] h-3.5 bg-white rounded-full origin-center"
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

  // ===== GEMINI LIVE BIDIRECTIONAL SPEECH-TO-SPEECH STATE =====
  const [isLiveMode, setIsLiveMode] = useState(false)
  const [liveState, setLiveState] = useState<LiveState>("idle")
  const [liveVoice, setLiveVoice] = useState("Puck")
  const [liveMicMuted, setLiveMicMuted] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState("")
  const [liveErrorMessage, setLiveErrorMessage] = useState<string | null>(null)
  const [inputVolume, setInputVolume] = useState(0)
  const [outputVolume, setOutputVolume] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const recognitionRef = useRef<any>(null)
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)

  // Live WebSocket & Audio Refs
  const wsRef = useRef<WebSocket | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const micAudioContextRef = useRef<AudioContext | null>(null)
  const playbackAudioContextRef = useRef<AudioContext | null>(null)
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([])
  const nextPlayTimeRef = useRef<number>(0)
  const animFrameRef = useRef<number | null>(null)
  const liveMicMutedRef = useRef(liveMicMuted)
  liveMicMutedRef.current = liveMicMuted

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
            if (event.error !== "no-speech" && event.error !== "aborted" && event.error !== "audio-capture") {
              console.warn("Speech recognition notice:", event.error)
            }
            setIsListening(false)
          }

          recognition.onend = () => {
            setIsListening(false)
          }

          recognitionRef.current = recognition
        } catch (e) {
          console.warn("SpeechRecognition init failed", e)
          setSttSupported(false)
        }
      } else {
        setSttSupported(false)
      }
    }

    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel()
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {}
      }
    }
  }, [])

  // Text to Speech output
  const speakText = useCallback(
    (text: string) => {
      if (isMuted || !speechSynthRef.current) return

      speechSynthRef.current.cancel()
      const cleanText = cleanTextForSpeech(text)
      if (!cleanText) return

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 1.05
      utterance.pitch = 1.0
      utterance.lang = "en-US"

      const voices = speechSynthRef.current.getVoices()
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") ||
            v.name.includes("Natural") ||
            v.name.includes("Samantha") ||
            v.name.includes("Daniel") ||
            v.name.includes("Karen"))
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthRef.current.speak(utterance)
    },
    [isMuted]
  )

  // Toggle standard speech recognition
  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      try {
        recognitionRef.current.stop()
      } catch (e) {}
      setIsListening(false)
    } else {
      try {
        if (speechSynthRef.current) {
          speechSynthRef.current.cancel()
          setIsSpeaking(false)
        }
        recognitionRef.current.start()
      } catch (e) {
        console.error("Speech recognition start failed:", e)
      }
    }
  }

  // =========================================================================
  // GEMINI LIVE REAL-TIME SPEECH-TO-SPEECH AUDIO PIPELINE
  // =========================================================================
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = ""
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  const base64PcmToAudioBuffer = (
    base64Pcm: string,
    audioContext: AudioContext
  ): AudioBuffer => {
    const binary = atob(base64Pcm)
    const len = binary.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    const int16Array = new Int16Array(bytes.buffer)
    const numSamples = int16Array.length
    const audioBuffer = audioContext.createBuffer(1, numSamples, 24000)
    const channelData = audioBuffer.getChannelData(0)

    for (let i = 0; i < numSamples; i++) {
      channelData[i] = int16Array[i] / 32768.0
    }

    return audioBuffer
  }

  const cleanupLiveCall = useCallback(() => {
    if (wsRef.current) {
      try {
        wsRef.current.close()
      } catch (e) {}
      wsRef.current = null
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop())
      micStreamRef.current = null
    }

    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop()
      } catch (e) {}
    })
    activeSourcesRef.current = []

    if (micAudioContextRef.current) {
      try {
        micAudioContextRef.current.close()
      } catch (e) {}
      micAudioContextRef.current = null
    }

    if (playbackAudioContextRef.current) {
      try {
        playbackAudioContextRef.current.close()
      } catch (e) {}
      playbackAudioContextRef.current = null
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }

    nextPlayTimeRef.current = 0
    setInputVolume(0)
    setOutputVolume(0)
    setLiveState("idle")
    setLiveErrorMessage(null)
  }, [])

  const startLiveCall = async () => {
    setIsLiveMode(true)
    setLiveState("connecting")
    setLiveErrorMessage(null)
    setLiveTranscript("")

    // Stop any ongoing text-to-speech or listening
    if (speechSynthRef.current) speechSynthRef.current.cancel()
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (e) {}
      setIsListening(false)
    }

    try {
      // 1. Fetch ephemeral token from /api/session
      const tokenRes = await fetch("/api/session", { method: "POST" })
      if (!tokenRes.ok) throw new Error("Could not retrieve session token")
      const { token } = await tokenRes.json()
      if (!token) throw new Error("Invalid session token received")

      // 2. Playback AudioContext (24kHz output)
      const PlaybackCtx = window.AudioContext || (window as any).webkitAudioContext
      const playbackCtx = new PlaybackCtx({ sampleRate: 24000 })
      if (playbackCtx.state === "suspended") {
        await playbackCtx.resume()
      }
      playbackAudioContextRef.current = playbackCtx
      nextPlayTimeRef.current = playbackCtx.currentTime

      // 3. Connect to Gemini Live WebSocket
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(
        token
      )}`
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = async () => {
        // Send initial setup frame
        const setupFrame = {
          setup: {
            model: "models/gemini-2.0-flash-exp",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: liveVoice,
                  },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
          },
        }

        ws.send(JSON.stringify(setupFrame))

        // 4. Initialize Microphone Input Audio Pipeline
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              sampleRate: 16000,
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          })
          micStreamRef.current = micStream

          const MicCtx = window.AudioContext || (window as any).webkitAudioContext
          const micCtx = new MicCtx({ sampleRate: 16000 })
          if (micCtx.state === "suspended") {
            await micCtx.resume()
          }
          micAudioContextRef.current = micCtx

          await micCtx.audioWorklet.addModule("/audio-processor.js")
          const workletNode = new AudioWorkletNode(micCtx, "audio-processor")
          const sourceNode = micCtx.createMediaStreamSource(micStream)

          // Volume meter
          const analyser = micCtx.createAnalyser()
          analyser.fftSize = 64
          sourceNode.connect(analyser)
          sourceNode.connect(workletNode)

          const dataArray = new Uint8Array(analyser.frequencyBinCount)
          const checkVolume = () => {
            if (!micStreamRef.current) return
            analyser.getByteFrequencyData(dataArray)
            let sum = 0
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i]
            }
            const avg = sum / dataArray.length
            setInputVolume(Math.min(avg / 128, 1))
            animFrameRef.current = requestAnimationFrame(checkVolume)
          }
          checkVolume()

          // Send 16-bit PCM chunks to Gemini WebSocket
          workletNode.port.onmessage = (event: MessageEvent) => {
            if (
              ws.readyState === WebSocket.OPEN &&
              !liveMicMutedRef.current &&
              event.data instanceof ArrayBuffer
            ) {
              const base64Data = arrayBufferToBase64(event.data)
              const audioMessage = {
                realtimeInput: {
                  mediaChunks: [
                    {
                      mimeType: "audio/pcm;rate=16000",
                      data: base64Data,
                    },
                  ],
                },
              }
              ws.send(JSON.stringify(audioMessage))
            }
          }

          setLiveState("listening")
        } catch (micErr: any) {
          console.error("Microphone access error:", micErr)
          setLiveErrorMessage(
            micErr.name === "NotAllowedError"
              ? "Microphone access was denied. Please allow microphone permissions."
              : "Unable to start audio input. Please check your microphone."
          )
          setLiveState("error")
        }
      }

      // Handle server responses (model audio output & transcripts)
      ws.onmessage = async (event: MessageEvent) => {
        try {
          let responseData = event.data
          if (responseData instanceof Blob) {
            responseData = await responseData.text()
          }

          const parsed = JSON.parse(responseData)

          // 1. Check if model interrupted previous speech
          if (parsed.serverContent?.interrupted) {
            activeSourcesRef.current.forEach((src) => {
              try {
                src.stop()
              } catch (e) {}
            })
            activeSourcesRef.current = []
            if (playbackAudioContextRef.current) {
              nextPlayTimeRef.current = playbackAudioContextRef.current.currentTime
            }
            setOutputVolume(0)
            setLiveState("listening")
            return
          }

          // 2. Check for model parts (audio & text)
          const parts = parsed.serverContent?.modelTurn?.parts
          if (Array.isArray(parts)) {
            for (const part of parts) {
              if (part.inlineData?.data) {
                const base64Audio = part.inlineData.data
                const ctx = playbackAudioContextRef.current
                if (ctx) {
                  const buffer = base64PcmToAudioBuffer(base64Audio, ctx)
                  const source = ctx.createBufferSource()
                  source.buffer = buffer

                  const curTime = ctx.currentTime
                  const startTime = Math.max(nextPlayTimeRef.current, curTime)
                  source.start(startTime)
                  nextPlayTimeRef.current = startTime + buffer.duration

                  source.connect(ctx.destination)
                  activeSourcesRef.current.push(source)
                  setLiveState("speaking")
                  setOutputVolume(0.85)

                  source.onended = () => {
                    const idx = activeSourcesRef.current.indexOf(source)
                    if (idx > -1) activeSourcesRef.current.splice(idx, 1)
                    if (activeSourcesRef.current.length === 0) {
                      setOutputVolume(0)
                      setLiveState("listening")
                    }
                  }
                }
              }

              if (part.text) {
                setLiveTranscript((prev) => prev + " " + part.text)
              }
            }
          }

          // 3. Check turn completion
          if (parsed.serverContent?.turnComplete) {
            if (activeSourcesRef.current.length === 0) {
              setLiveState("listening")
            }
          }
        } catch (msgErr) {
          console.error("Error processing live websocket frame:", msgErr)
        }
      }

      ws.onerror = (err) => {
        console.error("Gemini Live WebSocket error:", err)
        setLiveErrorMessage("Connection to Gemini Live was interrupted.")
        setLiveState("error")
      }

      ws.onclose = () => {
        if (liveState !== "error") {
          setLiveState("idle")
        }
      }
    } catch (err: any) {
      console.error("Failed to start Gemini Live call:", err)
      setLiveErrorMessage(err.message || "Failed to establish live session")
      setLiveState("error")
    }
  }

  const endLiveCall = () => {
    cleanupLiveCall()
    setIsLiveMode(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupLiveCall()
    }
  }, [cleanupLiveCall])

  // Clear messages / Reset chat
  const handleResetChat = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel()
      setIsSpeaking(false)
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    cleanupLiveCall()
    setIsLiveMode(false)
    setMessages([])
    setInput("")
    setIsLoading(false)
  }

  // Feedback thumb actions
  const handleLike = (id: string, liked: boolean) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? { ...msg, liked: msg.liked === liked ? null : liked }
          : msg
      )
    )
  }

  // Copy response action
  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Send message handler (streaming POST /api/chat)
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim()
    if (!messageContent || isLoading) return

    if (speechSynthRef.current) {
      speechSynthRef.current.cancel()
      setIsSpeaking(false)
    }

    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (e) {}
      setIsListening(false)
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      createdAt: new Date(),
    }

    const assistantId = `assistant-${Date.now()}`
    const placeholderAssistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages([...updatedMessages, placeholderAssistantMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => scrollToBottom(true), 100)

    try {
      const abortController = new AbortController()
      abortControllerRef.current = abortController

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
                <span>Ask Shahid AI</span>
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
              {/* Animated Gemini Ambient Light Aura */}
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
                  <span className="text-xs font-medium text-zinc-300 tracking-wide font-jakarta">
                    {isLiveMode ? "Gemini Live" : "Shahid AI"}
                  </span>
                  {isLiveMode && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>

                {/* Right: Minimalist action icons */}
                <div className="flex items-center gap-1.5 text-zinc-400">
                  {isLiveMode ? (
                    <>
                      {/* Voice selector in live mode */}
                      <select
                        value={liveVoice}
                        onChange={(e) => {
                          setLiveVoice(e.target.value)
                          cleanupLiveCall()
                          setTimeout(() => startLiveCall(), 150)
                        }}
                        className="text-[11px] bg-[#181822] text-zinc-300 border border-white/10 rounded-full px-2 py-0.5 outline-none cursor-pointer hover:border-white/20 transition-colors"
                      >
                        {AVAILABLE_VOICES.map((v) => (
                          <option key={v.name} value={v.name} className="bg-[#121216] text-white">
                            {v.label}
                          </option>
                        ))}
                      </select>

                      {/* Switch back to Text Chat */}
                      <button
                        onClick={endLiveCall}
                        title="Switch to Text Mode"
                        className="w-7 h-7 rounded-full bg-[#1c1c22] hover:bg-[#282830] text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <MessageSquare size={13} />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Mute/Unmute TTS Audio */}
                      <button
                        onClick={() => {
                          setIsMuted(!isMuted)
                          if (!isMuted && speechSynthRef.current) {
                            speechSynthRef.current.cancel()
                            setIsSpeaking(false)
                          }
                        }}
                        title={isMuted ? "Unmute sound" : "Mute sound"}
                        className={`w-7 h-7 rounded-full bg-[#1c1c22] hover:bg-[#282830] flex items-center justify-center transition-colors ${
                          isMuted
                            ? "text-zinc-500 hover:text-zinc-400"
                            : "text-zinc-300 hover:text-white"
                        }`}
                      >
                        {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      </button>

                      {/* New Chat (+) */}
                      <button
                        onClick={handleResetChat}
                        title="New chat"
                        className="w-7 h-7 rounded-full bg-[#1c1c22] hover:bg-[#282830] text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </>
                  )}

                  {/* Close (X) */}
                  <button
                    onClick={() => {
                      if (isLiveMode) endLiveCall()
                      setIsOpen(false)
                    }}
                    title="Close"
                    className="w-7 h-7 rounded-full bg-[#1c1c22] hover:bg-[#282830] text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* BODY: GEMINI LIVE VIEW OR TEXT CHAT STREAM */}
              {/* ========================================================= */}
              {isLiveMode ? (
                /* ===== GEMINI LIVE VIEW ===== */
                <div className="relative flex-1 flex flex-col items-center justify-between p-6 z-10 select-none">
                  {/* Visualizer Aura Orb */}
                  <div className="relative w-40 h-40 my-auto flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale:
                          liveState === "speaking"
                            ? [1, 1.25 + outputVolume * 0.4, 1]
                            : liveState === "listening"
                            ? [1, 1.1 + inputVolume * 0.35, 1]
                            : 1,
                        opacity: liveState === "speaking" ? 0.85 : 0.45,
                      }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#3186FF]/35 via-[#14BB69]/25 to-[#FA4340]/30 blur-2xl pointer-events-none"
                    />

                    <motion.div
                      animate={{
                        scale:
                          liveState === "speaking"
                            ? [1, 1.12, 1]
                            : liveState === "listening"
                            ? [1, 1.06, 1]
                            : 1,
                        rotate: 360,
                      }}
                      transition={{
                        scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                        rotate: { repeat: Infinity, duration: 16, ease: "linear" },
                      }}
                      className="w-28 h-28 rounded-full border border-white/20 bg-gradient-to-tr from-[#12121a] via-[#1a1a24] to-[#121218] flex items-center justify-center shadow-2xl relative z-10"
                    >
                      {liveState === "connecting" && (
                        <Sparkles size={28} className="text-[#3186FF] animate-spin" />
                      )}

                      {liveState === "listening" && (
                        <Mic
                          size={28}
                          className={`${
                            liveMicMuted ? "text-red-400" : "text-emerald-400 animate-pulse"
                          }`}
                        />
                      )}

                      {liveState === "speaking" && (
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-5 rounded-full bg-[#3186FF] animate-pulse" />
                          <span className="w-1.5 h-8 rounded-full bg-[#14BB69] animate-pulse delay-75" />
                          <span className="w-1.5 h-10 rounded-full bg-[#F6C013] animate-pulse delay-150" />
                          <span className="w-1.5 h-7 rounded-full bg-[#FA4340] animate-pulse delay-200" />
                          <span className="w-1.5 h-4 rounded-full bg-[#3186FF] animate-pulse delay-300" />
                        </div>
                      )}

                      {liveState === "error" && (
                        <PhoneOff size={28} className="text-red-400" />
                      )}

                      {liveState === "idle" && (
                        <Sparkles size={28} className="text-zinc-400" />
                      )}
                    </motion.div>
                  </div>

                  {/* Status Headline */}
                  <div className="text-center mb-4">
                    <h3 className="text-base font-medium text-white font-jakarta">
                      {liveState === "connecting" && "Connecting to Gemini Live..."}
                      {liveState === "listening" &&
                        (liveMicMuted ? "Microphone Muted" : "Listening to you...")}
                      {liveState === "speaking" && "Shahid's AI is speaking..."}
                      {liveState === "error" && "Connection Error"}
                    </h3>

                    <p className="text-xs text-zinc-400 mt-1 max-w-[260px] mx-auto">
                      {liveState === "listening" &&
                        "Speak naturally. Interrupt anytime — the AI stops instantly."}
                      {liveState === "speaking" && "Speak or tap mute to interrupt."}
                      {liveState === "connecting" && "Starting real-time speech pipeline..."}
                      {liveErrorMessage && (
                        <span className="text-red-400">{liveErrorMessage}</span>
                      )}
                    </p>
                  </div>

                  {/* Live Transcript Snippet */}
                  {liveTranscript && (
                    <div className="w-full mb-4 p-3 rounded-2xl bg-[#14141c] border border-white/5 max-h-24 overflow-y-auto text-left">
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {liveTranscript}
                      </p>
                    </div>
                  )}

                  {/* Live Controls Bar */}
                  <div className="w-full flex items-center justify-center gap-4 pt-2">
                    {/* Mute Button */}
                    <button
                      onClick={() => setLiveMicMuted(!liveMicMuted)}
                      disabled={liveState === "connecting" || liveState === "error"}
                      className={`p-3 rounded-full border transition-all ${
                        liveMicMuted
                          ? "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
                          : "bg-[#181822] border-white/10 text-white hover:bg-white/10"
                      }`}
                      title={liveMicMuted ? "Unmute Microphone" : "Mute Microphone"}
                    >
                      {liveMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>

                    {/* End Live Call Button */}
                    <button
                      onClick={endLiveCall}
                      className="p-3 rounded-full bg-red-600/90 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30"
                      title="End Live Voice Mode"
                    >
                      <PhoneOff size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                /* ===== TEXT CHAT VIEW ===== */
                <>
                  {/* Messages Content Stream */}
                  <div
                    id="chatbot-messages"
                    className="relative flex-1 overflow-y-auto overscroll-contain chatbot-scrollbar px-4 py-3 sm:px-5 sm:py-3 space-y-4 scroll-smooth z-10"
                  >
                    {/* Empty / Welcome State */}
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center px-2 py-4 space-y-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-[#181820] flex items-center justify-center shadow-lg border border-white/5">
                            <Image
                              src="/skills/gemini.svg"
                              alt="Gemini AI"
                              width={32}
                              height={32}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f0f13] flex items-center justify-center">
                            <Sparkles size={8} className="text-white" />
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-[15px] font-semibold text-zinc-100 tracking-tight">
                            Hi, I'm Shahid's AI Assistant
                          </h4>
                          <p className="text-xs text-zinc-400 max-w-[260px] leading-relaxed">
                            Ask anything about my projects, tech stack, experience, or collaborate with me.
                          </p>
                        </div>

                        {/* Quick Prompts */}
                        <div className="w-full space-y-1.5 pt-2">
                          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
                            Suggested Questions
                          </span>
                          {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(suggestion)}
                              className="w-full text-left text-[12.5px] px-3.5 py-2 rounded-xl bg-[#181820]/90 hover:bg-[#20202a] text-zinc-300 hover:text-white border border-white/5 transition-all shadow-xs"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Messages Flow */}
                    {messages.map((message) => {
                      const isUser = message.role === "user"

                      return (
                        <div
                          key={message.id}
                          className={`flex flex-col ${
                            isUser ? "items-end" : "items-start"
                          } space-y-1.5`}
                        >
                          {/* Message Bubble */}
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed transition-all ${
                              isUser
                                ? "bg-[#3186FF] text-white rounded-br-xs shadow-md shadow-blue-500/10"
                                : "bg-[#181820] text-zinc-200 rounded-bl-xs border border-white/5"
                            }`}
                          >
                            {isUser ? (
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            ) : message.content ? (
                              <MarkdownContent content={message.content} />
                            ) : (
                              <div className="flex items-center gap-1.5 py-1 text-zinc-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-100" />
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-200" />
                              </div>
                            )}
                          </div>

                          {/* Inline Feedback & Action Controls for Assistant Responses */}
                          {!isUser && message.content && (
                            <div className="flex items-center gap-2.5 px-1 py-0.5 select-none text-zinc-500">
                              {/* Thumbs Up */}
                              <button
                                onClick={() => handleLike(message.id, true)}
                                title="Good response"
                                className={`hover:text-zinc-200 transition-colors ${
                                  message.liked === true ? "text-blue-400" : ""
                                }`}
                              >
                                <ThumbsUp size={13} />
                              </button>

                              {/* Thumbs Down */}
                              <button
                                onClick={() => handleLike(message.id, false)}
                                title="Bad response"
                                className={`hover:text-zinc-200 transition-colors ${
                                  message.liked === false ? "text-red-400" : ""
                                }`}
                              >
                                <ThumbsDown size={13} />
                              </button>

                              {/* Copy message */}
                              <button
                                onClick={() =>
                                  handleCopy(message.id, message.content)
                                }
                                title="Copy response"
                                className="text-zinc-500 hover:text-zinc-200 transition-colors"
                              >
                                {copiedId === message.id ? (
                                  <Check size={14} className="text-emerald-400" />
                                ) : (
                                  <Copy size={13} />
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
                      )
                    })}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Bottom Input Area */}
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
                    {isListening && (
                      <div className="mb-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-between text-xs text-red-400 animate-pulse">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          <span>Listening... Speak now</span>
                        </div>
                        <button
                          onClick={toggleSpeechRecognition}
                          className="underline text-[11px] font-medium text-red-300 hover:text-white"
                        >
                          Done
                        </button>
                      </div>
                    )}

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

                      {/* Microphone STT Icon */}
                      <button
                        id="chatbot-mic-btn"
                        onClick={toggleSpeechRecognition}
                        disabled={isLoading}
                        title={
                          isListening ? "Stop listening" : "Speech-to-Text Voice"
                        }
                        className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                          isListening
                            ? "text-red-400 animate-pulse"
                            : "text-zinc-400 hover:text-white"
                        }`}
                        aria-label="Toggle Voice Input"
                      >
                        {isListening ? <MicOff size={17} /> : <Mic size={17} />}
                      </button>

                      {/* Black Circular Waveform (Gemini Live) / Send Button Pill */}
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
                          onClick={startLiveCall}
                          title="Talk Live with Gemini AI"
                          className="group relative w-8 h-8 rounded-full bg-[#0a0a0d] hover:bg-[#1a1a24] text-white flex items-center justify-center transition-all shadow-sm hover:scale-105"
                          aria-label="Gemini Live Voice Assistant"
                        >
                          {/* Soft Gemini live indicator glow */}
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#14BB69] animate-ping" />
                          <WaveformBars active={false} />
                        </button>
                      )}
                    </div>

                    {/* Subtle Centered Footer Note */}
                    <div className="text-center mt-2 flex items-center justify-center gap-1.5">
                      <span className="text-[10.5px] font-sans text-zinc-500 font-normal tracking-tight">
                        Powered by Gemini Live & Flash
                      </span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
