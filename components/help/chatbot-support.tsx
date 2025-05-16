"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatbotSupport() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        wallet:
          "To set up a wallet, you can use MetaMask, Coinbase Wallet, or WalletConnect. Would you like a step-by-step guide for any of these options?",
        ticket:
          "If you're having issues with your tickets, please check your ticket wallet to ensure they've been properly transferred to your account. If you still have problems, you can verify the transaction on the blockchain explorer.",
        refund:
          "Refunds are processed automatically through smart contracts if an event is canceled. For other refund requests, please contact the event organizer directly through the event page.",
        transfer:
          "You can transfer your ticket by going to your ticket wallet, selecting the ticket, and clicking the 'Transfer' button. You'll need the recipient's wallet address or email.",
        blockchain:
          "Blockchain technology provides a secure, transparent way to verify ticket ownership and prevent fraud. Each ticket is a unique NFT that can't be duplicated or counterfeited.",
        default:
          "I'm here to help with any questions about tickets, wallets, events, or blockchain technology. Could you provide more details about what you need assistance with?",
      }

      // Simple keyword matching for demo purposes
      let responseText = botResponses.default
      const lowercaseInput = input.toLowerCase()

      Object.entries(botResponses).forEach(([keyword, response]) => {
        if (lowercaseInput.includes(keyword) && keyword !== "default") {
          responseText = response
        }
      })

      const botMessage: Message = {
        id: Date.now().toString(),
        content: responseText,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Assistant" />
            <AvatarFallback>
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">BlockTix Support</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70 text-right">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
