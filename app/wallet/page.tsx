"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Copy, ExternalLink, RefreshCw, DollarSign, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"
import Link from "next/link"

export default function WalletPage() {
  const { isAuthenticated, isLoading, setIsAuthenticated, setIsLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // For testing, always set authenticated to true
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div className="container py-8">Loading...</div>
  }

  // Mock wallet data
  const walletAddress = "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
  const walletBalance = 2.45
  const transactions = [
    {
      id: "1",
      type: "receive",
      amount: 1.5,
      from: "0xabcd...1234",
      to: "You",
      date: "May 10, 2025",
      status: "Completed",
    },
    {
      id: "2",
      type: "send",
      amount: 0.5,
      from: "You",
      to: "0xefgh...5678",
      date: "May 5, 2025",
      status: "Completed",
    },
    {
      id: "3",
      type: "receive",
      amount: 1.45,
      from: "0xijkl...9012",
      to: "You",
      date: "April 28, 2025",
      status: "Completed",
    },
  ]

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blockchain Wallet</h1>
          <p className="text-muted-foreground">Manage your crypto wallet and event tickets</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/wallet/setup">
            <Wallet className="mr-2 h-4 w-4" /> Wallet Setup Guide
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Wallet Overview</CardTitle>
            <CardDescription>Your blockchain wallet details and balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-muted rounded-lg mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-background p-2 rounded text-sm font-mono">
                      {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 8)}
                    </code>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy address</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View on blockchain</span>
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Balance</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{walletBalance} ETH</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Refresh balance</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1">
                <ArrowUpRight className="mr-2 h-4 w-4" /> Send
              </Button>
              <Button className="flex-1">
                <ArrowDownLeft className="mr-2 h-4 w-4" /> Receive
              </Button>
              <Button variant="outline" className="flex-1">
                <DollarSign className="mr-2 h-4 w-4" /> Buy Crypto
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket NFTs</CardTitle>
            <CardDescription>Your event tickets as NFTs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Tech Conference 2025</h3>
                    <p className="text-sm text-muted-foreground">VIP Pass</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <p className="text-sm flex items-center">
                  <Clock className="mr-2 h-3 w-3" /> June 15, 2025
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Blockchain Summit</h3>
                    <p className="text-sm text-muted-foreground">Standard Admission</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <p className="text-sm flex items-center">
                  <Clock className="mr-2 h-3 w-3" /> August 5, 2025
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/tickets">View All Tickets</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent activity in your wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">From/To</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-right py-3 px-4">Amount</th>
                      <th className="text-right py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {tx.type === "receive" ? (
                              <ArrowDownLeft className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowUpRight className="mr-2 h-4 w-4 text-blue-500" />
                            )}
                            {tx.type === "receive" ? "Received" : "Sent"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-sm">{tx.type === "receive" ? "From:" : "To:"}</span>
                            <span className="font-medium">{tx.type === "receive" ? tx.from : tx.to}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{tx.date}</td>
                        <td className="text-right py-3 px-4 font-medium">
                          {tx.type === "receive" ? "+" : "-"}
                          {tx.amount} ETH
                        </td>
                        <td className="text-right py-3 px-4">
                          <Badge variant="outline">{tx.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
