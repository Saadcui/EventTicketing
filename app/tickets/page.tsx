"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, MapPin, Ticket, QrCode, Download } from "lucide-react"

export default function TicketsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tickets, setTickets] = useState([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchTickets() {
      try {
        // Check if user is authenticated
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)
        const userId = sessionData.session.user.id

        // Fetch tickets for this user
        const { data: ticketsData, error } = await supabase
          .from("tickets")
          .select(`
            *,
            events(id, title, date, location, image_url),
            ticket_types(name, price)
          `)
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching tickets:", error)
        } else {
          setTickets(ticketsData || [])
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Tickets error:", error)
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [])

  // Separate tickets by status (default to active if status is not set)
  const activeTickets = tickets.filter((ticket) => ticket.status === "active" || !ticket.status)
  const usedTickets = tickets.filter((ticket) => ticket.status === "used")
  const transferredTickets = tickets.filter((ticket) => ticket.status === "transferred")

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tickets...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You need to be logged in to view your tickets.</p>
            <Button asChild>
              <Link href="/auth/login?redirect=/tickets">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tickets</h1>
          <p className="text-muted-foreground">View and manage your event tickets</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="mb-8">
        <TabsList>
          <TabsTrigger value="active">Active ({activeTickets.length})</TabsTrigger>
          <TabsTrigger value="used">Used ({usedTickets.length})</TabsTrigger>
          <TabsTrigger value="transferred">Transferred ({transferredTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <TicketList tickets={activeTickets} />
        </TabsContent>

        <TabsContent value="used" className="mt-6">
          <TicketList tickets={usedTickets} />
        </TabsContent>

        <TabsContent value="transferred" className="mt-6">
          <TicketList tickets={transferredTickets} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Blockchain Verification</CardTitle>
          <CardDescription>All your tickets are secured as NFTs on the Solana blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-medium mb-2">Verify Your Tickets</h3>
              <p className="text-muted-foreground mb-4">
                Your tickets are secured as NFTs on the Solana blockchain, ensuring authenticity and preventing fraud.
                You can verify ownership and transfer tickets securely.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" asChild>
                  <Link href="/wallet/setup">
                    <QrCode className="mr-2 h-4 w-4" /> Connect Wallet
                  </Link>
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export Ticket Records
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Simple ticket list component
function TicketList({ tickets }: { tickets: any[] }) {
  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Tickets Found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            You don't have any tickets in this category. Discover events and purchase tickets to see them here.
          </p>
          <Button asChild>
            <Link href="/discover">Discover Events</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="overflow-hidden">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={ticket.events?.image_url || "/placeholder.svg?height=400&width=600"}
              alt={ticket.events?.title || "Event"}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{ticket.events?.title || "Unknown Event"}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                {ticket.events?.date || "Date not available"}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {ticket.events?.location || "Location not available"}
              </div>
              <div className="flex items-center text-sm font-medium">
                <Ticket className="mr-2 h-4 w-4 text-muted-foreground" />
                {ticket.ticket_types?.name || "Standard Ticket"} - ${ticket.ticket_types?.price?.toFixed(2) || "0.00"}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1">View Ticket</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
