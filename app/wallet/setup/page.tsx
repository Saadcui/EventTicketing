"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Wallet, ExternalLink, Shield, Zap, Globe } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/lib/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/hooks/use-toast"

export default function WalletSetupPage() {
  const { user, isLoading } = useAuth()
  const [walletAddress, setWalletAddress] = useState("")
  const [walletExists, setWalletExists] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkWallet = async () => {
      if (!user) return

      try {
        setIsLoadingWallet(true)
        // Check if user already has a wallet
        const { data, error } = await supabase.from("wallet").select("*").eq("user_id", user.id).single()

        if (error && error.code !== "PGRST116") {
          console.error("Error checking wallet:", error)
        }

        if (data) {
          setWalletExists(true)
          setWalletAddress(data.address || "")
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoadingWallet(false)
      }
    }

    if (user) {
      checkWallet()
    }
  }, [user, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (!user) {
        setError("You must be logged in to save wallet information")
        return
      }

      if (!walletAddress.trim()) {
        setError("Please enter a valid wallet address")
        return
      }

      if (walletExists) {
        // Update existing wallet
        const { error } = await supabase
          .from("wallet")
          .update({
            address: walletAddress,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)

        if (error) {
          console.error("Error updating wallet:", error)
          setError("Failed to update wallet information")
          return
        }
      } else {
        // Create new wallet
        const { error } = await supabase.from("wallet").insert({
          user_id: user.id,
          address: walletAddress,
          balance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (error) {
          console.error("Error creating wallet:", error)
          setError("Failed to save wallet information")
          return
        }

        setWalletExists(true)
      }

      // Also update the profile with wallet address
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          wallet_address: walletAddress,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (profileError) {
        console.error("Error updating profile:", profileError)
      }

      setSuccess("Wallet information saved successfully")
      toast({
        title: "Wallet saved",
        description: "Your wallet has been connected successfully",
      })
    } catch (error) {
      console.error("Error saving wallet:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <WalletSetupSkeleton />
  }

  if (!user) {
    return (
      <div className="container py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to set up your wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/auth/login?redirect=/wallet/setup">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-start gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Wallet Setup</h1>
          <p className="text-muted-foreground">
            Connect your blockchain wallet to purchase and store your event tickets as NFTs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>Enter your Solana wallet address to connect it to your account</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingWallet ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-64" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert variant="default" className="bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="walletAddress">Solana Wallet Address</Label>
                    <Input
                      id="walletAddress"
                      placeholder="Enter your Solana wallet address (e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="font-mono text-sm"
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
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Why Connect a Wallet?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Enhanced Security</h4>
                    <p className="text-sm text-muted-foreground">Your tickets are stored as NFTs on the blockchain, making them tamper-proof and verifiable.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Easy Transfers</h4>
                    <p className="text-sm text-muted-foreground">Transfer tickets to friends or sell them on secondary markets with blockchain verification.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Global Access</h4>
                    <p className="text-sm text-muted-foreground">Access your tickets from anywhere in the world with just your wallet.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Don't have a Solana wallet?</CardTitle>
                <CardDescription>Create a wallet to start buying and storing NFT tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant="outline" className="h-auto p-4" asChild>
                    <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
                      <div className="flex flex-col items-center gap-2">
                        <Wallet className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium">Phantom</div>
                          <div className="text-xs text-muted-foreground">Most popular</div>
                        </div>
                      </div>
                    </a>
                  </Button>
                  <Button variant="outline" className="h-auto p-4" asChild>
                    <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer">
                      <div className="flex flex-col items-center gap-2">
                        <ExternalLink className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium">Solflare</div>
                          <div className="text-xs text-muted-foreground">Web & mobile</div>
                        </div>
                      </div>
                    </a>
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">What is a Solana wallet?</h4>
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
      </div>
    </div>
  )
}

function WalletSetupSkeleton() {
  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-start gap-4 mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
