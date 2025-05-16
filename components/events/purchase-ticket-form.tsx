"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface PurchaseTicketFormProps {
  eventId: string
  ticketTypeId: string
  ticketName: string
  ticketPrice: number
  maxQuantity: number
}

export function PurchaseTicketForm({
  eventId,
  ticketTypeId,
  ticketName,
  ticketPrice,
  maxQuantity,
}: PurchaseTicketFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0 && value <= maxQuantity) {
      setQuantity(value)
    }
  }

  const handlePurchase = async () => {
    setIsSubmitting(true)
    try {
      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to purchase tickets.",
          variant: "destructive",
        })
        router.push(`/auth/login?redirect=/events/${eventId}`)
        return
      }

      const userId = sessionData.session.user.id

      // Create tickets
      const tickets = []
      for (let i = 0; i < quantity; i++) {
        const { data: ticket, error } = await supabase
          .from("tickets")
          .insert({
            ticket_type_id: ticketTypeId,
            event_id: eventId,
            user_id: userId,
            status: "active",
            purchase_date: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating ticket:", error)
          throw error
        }

        tickets.push(ticket)
      }

      // Update ticket type quantity
      const { data: ticketType, error: ticketTypeError } = await supabase
        .from("ticket_types")
        .select("quantity")
        .eq("id", ticketTypeId)
        .single()

      if (ticketTypeError) {
        console.error("Error fetching ticket type:", ticketTypeError)
        throw ticketTypeError
      }

      const newQuantity = ticketType.quantity - quantity

      const { error: updateError } = await supabase
        .from("ticket_types")
        .update({ quantity: newQuantity })
        .eq("id", ticketTypeId)

      if (updateError) {
        console.error("Error updating ticket type quantity:", updateError)
        throw updateError
      }

      toast({
        title: "Purchase successful",
        description: `You have purchased ${quantity} ${ticketName} ticket${quantity > 1 ? "s" : ""}.`,
      })

      // Redirect to tickets page
      router.push("/tickets")
      router.refresh()
    } catch (error) {
      console.error("Error purchasing tickets:", error)
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticketName}</CardTitle>
        <CardDescription>Purchase tickets for this event</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={handleQuantityChange}
            />
            <p className="text-sm text-muted-foreground">{maxQuantity} tickets available</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Price per ticket:</span>
              <span>${ticketPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${(ticketPrice * quantity).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handlePurchase} disabled={isSubmitting || maxQuantity < 1}>
          {isSubmitting ? "Processing..." : maxQuantity < 1 ? "Sold Out" : "Purchase Tickets"}
        </Button>
      </CardFooter>
    </Card>
  )
}
