"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, QrCode, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Ticket {
  id: string
  status: string
  purchase_date: string
  events: {
    id: string
    title: string
    date: string
    location: string
    image_url: string | null
  }
  ticket_types: {
    name: string
    price: number
  }
}

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  const [transferringTicket, setTransferringTicket] = useState<string | null>(null)
  const [recipientEmail, setRecipientEmail] = useState("")
  const { toast } = useToast()
  const supabase = createClient()
  const router = useRouter()

  const handleTransferTicket = async (ticketId: string) => {
    if (!recipientEmail) {
      toast({
        title: "Email required",
        description: "Please enter the recipient's email address",
        variant: "destructive",
      })
      return
    }

    setTransferringTicket(ticketId)

    try {
      // Check if recipient exists
      const { data: recipientData, error: recipientError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", recipientEmail)
        .single()

      if (recipientError || !recipientData) {
        toast({
          title: "Recipient not found",
          description: "The email address does not belong to a registered user",
          variant: "destructive",
        })
        return
      }

      // Update ticket ownership
      const { error: transferError } = await supabase
        .from("tickets")
        .update({
          user_id: recipientData.id,
          status: "transferred",
        })
        .eq("id", ticketId)

      if (transferError) {
        throw transferError
      }

      // Create transaction record
      const { error: transactionError } = await supabase.from("transactions").insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        ticket_id: ticketId,
        type: "transfer",
        amount: 0,
        status: "completed",
      })

      if (transactionError) {
        throw transactionError
      }

      toast({
        title: "Ticket transferred",
        description: `Ticket successfully transferred to ${recipientEmail}`,
      })

      // Reset form and refresh
      setRecipientEmail("")
      router.refresh()
    } catch (error) {
      console.error("Error transferring ticket:", error)
      toast({
        title: "Transfer failed",
        description: "An error occurred while transferring the ticket",
        variant: "destructive",
      })
    } finally {
      setTransferringTicket(null)
    }
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You don't have any tickets in this category.</p>
        <Button asChild>
          <Link href="/discover">Browse Events</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="overflow-hidden">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={ticket.events.image_url || "/placeholder.svg?height=400&width=600"}
              alt={ticket.events.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="font-medium">
                {ticket.ticket_types.name}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{ticket.events.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                {ticket.events.date}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {ticket.events.location}
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <QrCode className="h-4 w-4 mr-2" /> View Ticket
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ticket QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="bg-white p-4 rounded-lg">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold">{ticket.events.title}</h3>
                    <p className="text-sm text-muted-foreground">{ticket.ticket_types.name}</p>
                    <p className="text-sm text-muted-foreground">{ticket.events.date}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {ticket.status === "active" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Send className="h-4 w-4 mr-2" /> Transfer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer Ticket</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Enter the email address of the person you want to transfer this ticket to.
                    </p>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Recipient Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full p-2 border rounded-md"
                        placeholder="email@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleTransferTicket(ticket.id)}
                      disabled={transferringTicket === ticket.id}
                    >
                      {transferringTicket === ticket.id ? "Transferring..." : "Transfer Ticket"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
