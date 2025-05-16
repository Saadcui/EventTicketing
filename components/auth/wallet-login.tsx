"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { signInWithWallet } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"

export default function WalletLogin() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const walletOptions = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "M113.313 401.644l-26.16 87.54 98.046-.216 25.62-87.324h-97.506zM220.157 296.469l-23.541 105.175h97.507l23.542-105.175h-97.508zM338.839 401.644l26.161 87.54-98.046-.216-25.62-87.324h97.505zM231.996 296.469l23.541 105.175h-97.507l-23.542-105.175h97.508z",
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      icon: "M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm64 112a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm80 104a32 32 0 1 1 0 64 32 32 0 1 1 0-64z",
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "M223.779 0C100.192 0 0 100.192 0 223.779s100.192 223.779 223.779 223.779 223.779-100.192 223.779-223.779S347.366 0 223.779 0zm0 410.454c-103.098 0-186.675-83.577-186.675-186.675S120.681 37.104 223.779 37.104s186.675 83.577 186.675 186.675-83.577 186.675-186.675 186.675zm47.873-193.399c-7.529-9.822-18.564-15.075-31.04-15.075s-23.511 5.253-31.04 15.075l-33.693 44.122c-1.632 2.135-1.227 5.169.908 6.801a4.824 4.824 0 0 0 6.801-.908l33.693-44.122c5.761-7.529 14.221-11.646 23.331-11.646s17.57 4.117 23.331 11.646l33.693 44.122a4.822 4.822 0 0 0 6.801.908 4.824 4.824 0 0 0 .908-6.801l-33.693-44.122zm-78.913 44.122l-33.693 44.122c-5.761 7.529-14.221 11.646-23.331 11.646s-17.57-4.117-23.331-11.646l-33.693-44.122a4.824 4.824 0 0 0-6.801-.908 4.824 4.824 0 0 0-.908 6.801l33.693 44.122c7.529 9.822 18.564 15.075 31.04 15.075s23.511-5.253 31.04-15.075l33.693-44.122c1.632-2.135 1.227-5.169-.908-6.801a4.824 4.824 0 0 0-6.801.908zm110.861-44.122l33.693 44.122a4.822 4.822 0 0 0 6.801.908 4.824 4.824 0 0 0 .908-6.801l-33.693-44.122c-7.529-9.822-18.564-15.075-31.04-15.075s-23.511 5.253-31.04 15.075l-33.693 44.122c-1.632 2.135-1.227 5.169.908 6.801a4.824 4.824 0 0 0 6.801-.908l33.693-44.122c5.761-7.529 14.221-11.646 23.331-11.646s17.57 4.117 23.331 11.646z",
    },
  ]

  const handleConnectWallet = async (walletId: string) => {
    setIsConnecting(true)
    setError(null)

    try {
      // In a real app, you would use a library like ethers.js or web3.js to connect to the wallet
      if (walletId === "metamask") {
        // Check if MetaMask is installed
        if (typeof window !== "undefined" && !(window as any).ethereum) {
          setError("MetaMask is not installed. Please install MetaMask to continue.")
          return
        }
      }

      // Call the signInWithWallet function
      const result = await signInWithWallet(walletId)

      if (result?.error) {
        setError(result.error)
        toast({
          title: "Connection failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Wallet connected",
          description: "Successfully connected your wallet.",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      setError("Failed to connect wallet. Please try again.")
      toast({
        title: "Connection failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        {walletOptions.map((wallet) => (
          <Button
            key={wallet.id}
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={() => handleConnectWallet(wallet.id)}
            disabled={isConnecting}
          >
            <div className="flex items-center w-full">
              <div className="mr-3 h-6 w-6 flex-shrink-0">
                <svg viewBox="0 0 512 512" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
                  <path d={wallet.icon} fill="currentColor" />
                </svg>
              </div>
              <div className="flex-1">{wallet.name}</div>
              {isConnecting && <div className="loading-spinner h-4 w-4" />}
            </div>
          </Button>
        ))}
      </div>

      <div className="pt-4">
        <p className="text-sm text-muted-foreground text-center">
          New to blockchain wallets?{" "}
          <a href="/help/wallet-setup" className="underline">
            Learn how to set up a wallet
          </a>
        </p>
      </div>
    </div>
  )
}
