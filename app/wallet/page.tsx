'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet, Send, ReceiptIcon as Receive, History, CreditCard, Coins, TrendingUp, ArrowUpRight, ArrowDownLeft, Copy } from 'lucide-react'
import { mockAuth } from '@/lib/mock-auth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface WalletBalance {
  currency: string
  amount: number
  usdValue: number
  change24h: number
}

interface Transaction {
  id: string
  type: 'send' | 'receive' | 'purchase' | 'refund'
  amount: number
  currency: string
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  txHash?: string
}

interface NFTTicket {
  id: string
  eventTitle: string
  tokenId: string
  imageUrl: string
  rarity: 'common' | 'rare' | 'legendary'
  mintDate: string
  value: number
}

export default function WalletPage() {
  const [user, setUser] = useState(mockAuth.getCurrentUser())
  const [balances, setBalances] = useState<WalletBalance[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [nftTickets, setNftTickets] = useState<NFTTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [walletAddress] = useState('0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = mockAuth.subscribe((state) => {
      setUser(state.user)
      if (!state.user && !state.isLoading) {
        router.push('/auth/login')
      }
    })

    return unsubscribe
  }, [router])

  useEffect(() => {
    if (user) {
      // Simulate loading wallet data
      setTimeout(() => {
        setBalances([
          {
            currency: 'ETH',
            amount: 2.45,
            usdValue: 4900,
            change24h: 3.2
          },
          {
            currency: 'USDC',
            amount: 1250.00,
            usdValue: 1250,
            change24h: 0.1
          },
          {
            currency: 'MATIC',
            amount: 850.75,
            usdValue: 680.60,
            change24h: -1.8
          }
        ])

        setTransactions([
          {
            id: 'tx-1',
            type: 'purchase',
            amount: 299,
            currency: 'USDC',
            description: 'Tech Conference 2024 - VIP Pass',
            date: '2024-02-01T10:30:00Z',
            status: 'completed',
            txHash: '0x1234567890abcdef'
          },
          {
            id: 'tx-2',
            type: 'receive',
            amount: 0.5,
            currency: 'ETH',
            description: 'Received from friend',
            date: '2024-01-28T15:45:00Z',
            status: 'completed',
            txHash: '0xabcdef1234567890'
          },
          {
            id: 'tx-3',
            type: 'purchase',
            amount: 89,
            currency: 'USDC',
            description: 'Music Festival Summer - General Admission',
            date: '2024-02-15T14:20:00Z',
            status: 'completed',
            txHash: '0x567890abcdef1234'
          },
          {
            id: 'tx-4',
            type: 'send',
            amount: 0.1,
            currency: 'ETH',
            description: 'Gas fee refund',
            date: '2024-02-10T09:15:00Z',
            status: 'completed',
            txHash: '0x90abcdef12345678'
          },
          {
            id: 'tx-5',
            type: 'purchase',
            amount: 199,
            currency: 'USDC',
            description: 'Business Summit - Early Bird',
            date: '2024-01-15T11:00:00Z',
            status: 'pending'
          }
        ])

        setNftTickets([
          {
            id: 'nft-1',
            eventTitle: 'Tech Conference 2024',
            tokenId: 'TC2024-001',
            imageUrl: '/placeholder.svg?height=200&width=200',
            rarity: 'legendary',
            mintDate: '2024-02-01T10:30:00Z',
            value: 450
          },
          {
            id: 'nft-2',
            eventTitle: 'Music Festival Summer',
            tokenId: 'MFS2024-002',
            imageUrl: '/placeholder.svg?height=200&width=200',
            rarity: 'rare',
            mintDate: '2024-02-15T14:20:00Z',
            value: 120
          },
          {
            id: 'nft-3',
            eventTitle: 'Art Exhibition Opening',
            tokenId: 'AEO2024-003',
            imageUrl: '/placeholder.svg?height=200&width=200',
            rarity: 'common',
            mintDate: '2024-02-20T16:45:00Z',
            value: 65
          }
        ])

        setLoading(false)
      }, 1000)
    }
  }, [user])

  const totalBalance = balances.reduce((sum, balance) => sum + balance.usdValue, 0)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "Address copied",
      description: "Wallet address has been copied to clipboard.",
    })
  }

  const handleSendTokens = () => {
    toast({
      title: "Send tokens",
      description: "Send tokens feature will be available soon.",
    })
  }

  const handleReceiveTokens = () => {
    toast({
      title: "Receive tokens",
      description: "Your wallet address has been copied to clipboard.",
    })
    navigator.clipboard.writeText(walletAddress)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'receive': return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case 'purchase': return <CreditCard className="h-4 w-4 text-blue-500" />
      case 'refund': return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      default: return <History className="h-4 w-4" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500'
      case 'rare': return 'bg-gradient-to-r from-purple-400 to-pink-500'
      case 'common': return 'bg-gradient-to-r from-gray-400 to-gray-600'
      default: return 'bg-gray-500'
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access your wallet</h2>
          <Button onClick={() => router.push('/auth/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">Manage your crypto assets and NFT tickets</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">Manage your crypto assets and NFT tickets</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSendTokens}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
            <Button onClick={handleReceiveTokens}>
              <Receive className="mr-2 h-4 w-4" />
              Receive
            </Button>
          </div>
        </div>

        {/* Wallet Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <code className="text-sm font-mono">{walletAddress}</code>
              <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Total balance across all assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">${totalBalance.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +5.2% (24h)
            </div>
          </CardContent>
        </Card>

        {/* Asset Balances */}
        <div className="grid gap-4 md:grid-cols-3">
          {balances.map((balance) => (
            <Card key={balance.currency}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{balance.currency}</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{balance.amount.toFixed(2)}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    ${balance.usdValue.toLocaleString()}
                  </p>
                  <p className={`text-xs ${balance.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balance.change24h >= 0 ? '+' : ''}{balance.change24h}%
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for Transactions and NFTs */}
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="nfts">NFT Tickets ({nftTickets.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest wallet activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(tx.type)}
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatDate(tx.date)}</span>
                            <Badge variant={
                              tx.status === 'completed' ? 'default' :
                              tx.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          tx.type === 'receive' || tx.type === 'refund' ? 'text-green-600' : 
                          tx.type === 'send' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {tx.type === 'receive' || tx.type === 'refund' ? '+' : '-'}
                          {tx.amount} {tx.currency}
                        </p>
                        {tx.txHash && (
                          <p className="text-xs text-muted-foreground font-mono">
                            {tx.txHash.slice(0, 10)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nfts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {nftTickets.map((nft) => (
                <Card key={nft.id} className="overflow-hidden">
                  <div className={`h-2 ${getRarityColor(nft.rarity)}`}></div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{nft.eventTitle}</CardTitle>
                        <CardDescription>Token ID: {nft.tokenId}</CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {nft.rarity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={nft.imageUrl || "/placeholder.svg"} 
                        alt={nft.eventTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Minted:</span>
                        <span>{formatDate(nft.mintDate)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Value:</span>
                        <span>${nft.value}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Transfer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {nftTickets.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No NFT Tickets Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Purchase event tickets to start collecting NFTs
                  </p>
                  <Button onClick={() => router.push('/discover')}>
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
