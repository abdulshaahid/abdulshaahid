"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:shahid.dev@example.com?subject=Portfolio Contact&body=${body}`
  }

  return (
    <section id="contact" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-serif text-3xl font-semibold">Get In Touch</h2>
          <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-zinc-300">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-white/20 bg-black text-white placeholder:text-zinc-500 focus-visible:ring-white"
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-zinc-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-white/20 bg-black text-white placeholder:text-zinc-500 focus-visible:ring-white"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="message" className="text-sm text-zinc-300">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[140px] rounded-xl border-white/20 bg-black text-white placeholder:text-zinc-500 focus-visible:ring-white"
                placeholder="Tell me about your project..."
                required
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full rounded-xl bg-white text-black hover:bg-zinc-200">
                Send
              </Button>
            </div>
          </form>
          <div className="mt-6 grid gap-2 text-sm text-zinc-400 md:grid-cols-2 lg:grid-cols-4">
            <p>
              Email:{" "}
              <a className="underline decoration-white/30 hover:text-white" href="mailto:shahidpallath623@gmail.com">
                shahidpallath623@gmail.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a className="hover:text-white" href="tel:+916282669441">
                +91 6282669441
              </a>
            </p>
            <p>
              <a
                className="hover:text-white"
                href="https://www.linkedin.com/in/mohamedabdulshahid/"
                target="_blank"
                rel="noreferrer"
              >
                Linkedin
              </a>
            </p>
             <p>
              <a
                className="hover:text-white"
                href="https://instagram.com/in/abdulshaahid/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </p>
          
          </div>
        </div>
      </div>
    </section>
  )
}
