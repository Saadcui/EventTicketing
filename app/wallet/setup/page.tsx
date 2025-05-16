"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Wallet, ExternalLink } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function WalletSetupPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [walletExists, setWalletExists] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        // For testing, always set authenticated to true
        setIsAuthenticated(true)

        // Set wallet data for testing
        setWalletExists(true)
        setWalletAddress("0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t")

        setIsLoading(false)
      } catch (error) {
        console.error("Auth error:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // For testing, just simulate a successful save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setWalletExists(true)
      setSuccess("Wallet information saved successfully")
    } catch (error) {
      console.error("Error saving wallet:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading wallet setup...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-start gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Wallet Setup</h1>
          <p className="text-muted-foreground">
            Connect your blockchain wallet to purchase and store your event tickets as NFTs
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Enter your Solana wallet address to connect it to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="walletAddress">Solana Wallet Address</Label>
                <Input
                  id="walletAddress"
                  placeholder="Enter your Solana wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">This is where your NFT tickets will be stored</p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : walletExists ? "Update Wallet" : "Connect Wallet"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Skip for Now</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Don't have a Solana wallet?</CardTitle>
            <CardDescription>Create a wallet to start buying and storing NFT tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="outline" className="flex-1" asChild>
                <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
                  <Wallet className="mr-2 h-4 w-4" /> Get Phantom Wallet
                </a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Get Solflare Wallet
                </a>
              </Button>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">What is a Solana wallet?</h3>
              <p className="text-sm text-muted-foreground">
                A Solana wallet is a digital tool that allows you to store, send, and receive Solana tokens and NFTs. In
                BlockTix, your event tickets are stored as NFTs on the Solana blockchain for enhanced security and
                transferability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
