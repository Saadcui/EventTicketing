'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QrCode, Download, Share2, Calendar, MapPin, Clock, Ticket } from 'lucide-react'
import { mockAuth } from '@/lib/mock-auth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface TicketData {
  id: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  ticketType: string
  price: number
  purchaseDate: string
  status: 'active' | 'used' | 'transferred' | 'expired'
  qrCode: string
  seatNumber?: string
  category: string
  nftTokenId?: string
}

export default function TicketsPage() {
  const [user, setUser] = useState(mockAuth.getCurrentUser())
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [loading, setLoading] = useState(true)
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
      // Simulate loading tickets data
      setTimeout(() => {
        setTickets([
          {
            id: 'ticket-1',
            eventTitle: 'Tech Conference 2024',
            eventDate: '2024-03-15T09:00:00Z',
            eventLocation: 'San Francisco, CA',
            ticketType: 'VIP Pass',
            price: 299,
            purchaseDate: '2024-02-01T10:30:00Z',
            status: 'active',
            qrCode: 'QR123456789',
            seatNumber: 'A-15',
            category: 'Technology',
            nftTokenId: 'NFT-001'
          },
          {
            id: 'ticket-2',
            eventTitle: 'Music Festival Summer',
            eventDate: '2024-04-20T18:00:00Z',
            eventLocation: 'Austin, TX',
            ticketType: 'General Admission',
            price: 89,
            purchaseDate: '2024-02-15T14:20:00Z',
            status: 'active',
            qrCode: 'QR987654321',
            category: 'Music',
            nftTokenId: 'NFT-002'
          },
          {
            id: 'ticket-3',
            eventTitle: 'Art Exhibition Opening',
            eventDate: '2024-02-28T19:00:00Z',
            eventLocation: 'New York, NY',
            ticketType: 'Premium',
            price: 45,
            purchaseDate: '2024-02-20T16:45:00Z',
            status: 'used',
            qrCode: 'QR456789123',
            category: 'Art',
            nftTokenId: 'NFT-003'
          },
          {
            id: 'ticket-4',
            eventTitle: 'Business Summit',
            eventDate: '2024-05-10T08:30:00Z',
            eventLocation: 'Chicago, IL',
            ticketType: 'Early Bird',
            price: 199,
            purchaseDate: '2024-01-15T11:00:00Z',
            status: 'active',
            qrCode: 'QR789123456',
            seatNumber: 'B-22',
            category: 'Business',
            nftTokenId: 'NFT-004'
          },
          {
            id: 'ticket-5',
            eventTitle: 'Food & Wine Expo',
            eventDate: '2024-03-25T12:00:00Z',
            eventLocation: 'Los Angeles, CA',
            ticketType: 'Tasting Pass',
            price: 75,
            purchaseDate: '2024-02-10T09:15:00Z',
            status: 'transferred',
            qrCode: 'QR321654987',
            category: 'Food'
          }
        ])
        setLoading(false)
      }, 1000)
    }
  }, [user])

  const handleDownloadTicket = (ticketId: string) => {
    toast({
      title: "Ticket downloaded",
      description: "Your ticket has been downloaded to your device.",
    })
  }

  const handleShareTicket = (ticketId: string) => {
    toast({
      title: "Share link copied",
      description: "The ticket share link has been copied to your clipboard.",
    })
  }

  const handleTransferTicket = (ticketId: string) => {
    toast({
      title: "Transfer initiated",
      description: "Ticket transfer process has been started.",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'used': return 'secondary'
      case 'transferred': return 'outline'
      case 'expired': return 'destructive'
      default: return 'default'
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your tickets</h2>
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
            <h1 className="text-3xl font-bold">My Tickets</h1>
            <p className="text-muted-foreground">Manage your event tickets</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const activeTickets = tickets.filter(t => t.status === 'active')
  const usedTickets = tickets.filter(t => t.status === 'used')
  const transferredTickets = tickets.filter(t => t.status === 'transferred')

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Tickets</h1>
            <p className="text-muted-foreground">Manage your event tickets and NFTs</p>
          </div>
          <Button onClick={() => router.push('/discover')}>
            <Ticket className="mr-2 h-4 w-4" />
            Browse Events
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTickets.length}</div>
              <p className="text-xs text-muted-foreground">
                Ready to use
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Used Tickets</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usedTickets.length}</div>
              <p className="text-xs text-muted-foreground">
                Events attended
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NFT Tickets</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tickets.filter(t => t.nftTokenId).length}</div>
              <p className="text-xs text-muted-foreground">
                Blockchain verified
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Management */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active ({activeTickets.length})</TabsTrigger>
            <TabsTrigger value="used">Used ({usedTickets.length})</TabsTrigger>
            <TabsTrigger value="transferred">Transferred ({transferredTickets.length})</TabsTrigger>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{ticket.eventTitle}</CardTitle>
                        <CardDescription>{ticket.ticketType}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(ticket.eventDate)}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        {ticket.eventLocation}
                      </div>
                      {ticket.seatNumber && (
                        <div className="flex items-center text-sm">
                          <Ticket className="mr-2 h-4 w-4" />
                          Seat: {ticket.seatNumber}
                        </div>
                      )}
                      <div className="flex items-center text-sm font-semibold">
                        <span>${ticket.price}</span>
                        {ticket.nftTokenId && (
                          <Badge variant="outline" className="ml-2">NFT</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleDownloadTicket(ticket.id)}>
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleShareTicket(ticket.id)}>
                        <Share2 className="mr-1 h-3 w-3" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleTransferTicket(ticket.id)}>
                        Transfer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="used" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {usedTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{ticket.eventTitle}</CardTitle>
                        <CardDescription>{ticket.ticketType}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(ticket.eventDate)}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        {ticket.eventLocation}
                      </div>
                      <div className="flex items-center text-sm font-semibold">
                        <span>${ticket.price}</span>
                        {ticket.nftTokenId && (
                          <Badge variant="outline" className="ml-2">NFT</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" disabled>
                        <QrCode className="mr-1 h-3 w-3" />
                        Used
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadTicket(ticket.id)}>
                        <Download className="mr-1 h-3 w-3" />
                        Receipt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="transferred" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {transferredTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden opacity-60">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{ticket.eventTitle}</CardTitle>
                        <CardDescription>{ticket.ticketType}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(ticket.eventDate)}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        {ticket.eventLocation}
                      </div>
                      <div className="flex items-center text-sm font-semibold">
                        <span>${ticket.price}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" disabled>
                        <Share2 className="mr-1 h-3 w-3" />
                        Transferred
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className={`overflow-hidden ${ticket.status !== 'active' ? 'opacity-75' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{ticket.eventTitle}</CardTitle>
                        <CardDescription>{ticket.ticketType}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(ticket.eventDate)}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        {ticket.eventLocation}
                      </div>
                      {ticket.seatNumber && (
                        <div className="flex items-center text-sm">
                          <Ticket className="mr-2 h-4 w-4" />
                          Seat: {ticket.seatNumber}
                        </div>
                      )}
                      <div className="flex items-center text-sm font-semibold">
                        <span>${ticket.price}</span>
                        {ticket.nftTokenId && (
                          <Badge variant="outline" className="ml-2">NFT</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {ticket.status === 'active' ? (
                        <>
                          <Button size="sm" onClick={() => handleDownloadTicket(ticket.id)}>
                            <Download className="mr-1 h-3 w-3" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleShareTicket(ticket.id)}>
                            <Share2 className="mr-1 h-3 w-3" />
                            Share
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" disabled>
                          {ticket.status === 'used' ? 'Used' : 'Transferred'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
