"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Wallet } from 'lucide-react'
import { useToast } from "@/frontend/hooks/use-toast"
import { MockAuth } from "@/lib/mock-auth"

export default function WalletLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleWalletConnect = async () => {
    setIsConnecting(true)
    
    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock wallet login - create a demo wallet user
      const walletAddress = "0x" + Math.random().toString(16).substr(2, 40)
      await MockAuth.signUp(`${walletAddress}@wallet.demo`, "wallet-auth", `Wallet User ${walletAddress.slice(0, 6)}`)
      
      toast({
        title: "Wallet connected",
        description: "Successfully connected with your wallet!",
      })
      
      router.refresh()
      router.replace("/dashboard")
      
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleWalletConnect}
      disabled={isConnecting}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
