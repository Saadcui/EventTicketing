"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface TicketType {
  id: string
  name: string
  price: number
  description: string
  available: number
  maxPerOrder: number
}

interface TicketSelectionProps {
  ticketTypes: TicketType[]
  eventId: string
}

export default function TicketSelection({ ticketTypes, eventId }: TicketSelectionProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleQuantityChange = (id: string, value: number) => {
    const ticketType = ticketTypes.find((t) => t.id === id)
    if (!ticketType) return

    // Ensure quantity is within limits
    const newValue = Math.max(0, Math.min(value, ticketType.maxPerOrder, ticketType.available))

    setQuantities((prev) => ({
      ...prev,
      [id]: newValue,
    }))
  }

  const calculateTotal = () => {
    return ticketTypes.reduce((total, ticket) => {
      const quantity = quantities[ticket.id] || 0
      return total + ticket.price * quantity
    }, 0)
  }

  const handleCheckout = async () => {
    try {
      // Check if user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to purchase tickets",
          variant: "destructive",
        })
        router.push(`/auth/login?returnUrl=/events/${eventId}`)
        return
      }

      // Check if any tickets are selected
      const totalQuantity = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)

      if (totalQuantity === 0) {
        toast({
          title: "No tickets selected",
          description: "Please select at least one ticket to continue",
          variant: "destructive",
        })
        return
      }

      setIsProcessing(true)

      // Process each ticket type
      for (const ticketType of ticketTypes) {
        const quantity = quantities[ticketType.id] || 0
        if (quantity === 0) continue

        // Create tickets
        for (let i = 0; i < quantity; i++) {
          const { error: ticketError } = await supabase.from("tickets").insert({
            ticket_type_id: ticketType.id,
            event_id: eventId,
            user_id: user.id,
            status: "active",
            purchase_date: new Date().toISOString(),
          })

          if (ticketError) {
            throw new Error(`Failed to create ticket: ${ticketError.message}`)
          }
        }

        // Update ticket type quantity
        const { error: updateError } = await supabase
          .from("ticket_types")
          .update({ quantity: ticketType.available - quantity })
          .eq("id", ticketType.id)

        if (updateError) {
          throw new Error(`Failed to update ticket availability: ${updateError.message}`)
        }

        // Create transaction record
        const { error: transactionError } = await supabase.from("transactions").insert({
          user_id: user.id,
          event_id: eventId,
          type: "purchase",
          amount: ticketType.price * quantity,
          status: "completed",
        })

        if (transactionError) {
          throw new Error(`Failed to record transaction: ${transactionError.message}`)
        }
      }

      toast({
        title: "Purchase successful!",
        description: "Your tickets have been added to your account",
      })

      // Redirect to tickets page
      router.push("/tickets")
      router.refresh()
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error.message || "An error occurred during checkout",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (ticketTypes.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No tickets available for this event.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {ticketTypes.map((ticket) => (
        <div key={ticket.id} className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{ticket.name}</h3>
              <p className="text-sm text-muted-foreground">{ticket.description}</p>
            </div>
            <div className="text-right">
              <div className="font-medium">${ticket.price.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{ticket.available} available</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor={`quantity-${ticket.id}`} className="sr-only">
              Quantity
            </Label>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(ticket.id, (quantities[ticket.id] || 0) - 1)}
              disabled={!quantities[ticket.id]}
            >
              -
            </Button>
            <Input
              id={`quantity-${ticket.id}`}
              type="number"
              min="0"
              max={Math.min(ticket.maxPerOrder, ticket.available)}
              className="h-8 w-16 text-center"
              value={quantities[ticket.id] || 0}
              onChange={(e) => handleQuantityChange(ticket.id, Number.parseInt(e.target.value) || 0)}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(ticket.id, (quantities[ticket.id] || 0) + 1)}
              disabled={(quantities[ticket.id] || 0) >= Math.min(ticket.maxPerOrder, ticket.available)}
            >
              +
            </Button>
          </div>
        </div>
      ))}

      <Separator className="my-4" />

      <div className="flex justify-between items-center font-medium">
        <span>Total</span>
        <span>${calculateTotal().toFixed(2)}</span>
      </div>

      <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          "Checkout"
        )}
      </Button>
    </div>
  )
}
