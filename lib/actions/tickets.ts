"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"

type TicketType = Database["public"]["Tables"]["ticket_types"]["Row"]
type Ticket = Database["public"]["Tables"]["tickets"]["Row"]

export async function createTicketType(eventId: string, formData: FormData) {
  const supabase = createActionClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a ticket type" }
  }

  // Verify the user is the event organizer
  const { data: event } = await supabase.from("events").select("organizer_id").eq("id", eventId).single()

  if (!event || event.organizer_id !== user.id) {
    return { error: "You do not have permission to create ticket types for this event" }
  }

  // Extract ticket type data from form
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const maxPerOrder = Number.parseInt(formData.get("maxPerOrder") as string) || 10

  // Create the ticket type
  const { error } = await supabase.from("ticket_types").insert({
    event_id: eventId,
    name,
    description,
    price,
    quantity,
    max_per_order: maxPerOrder,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/events/${eventId}/edit`)
  return { success: true }
}

export async function updateTicketType(id: string, formData: FormData) {
  const supabase = createActionClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to update a ticket type" }
  }

  // Extract ticket type data from form
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const maxPerOrder = Number.parseInt(formData.get("maxPerOrder") as string) || 10

  // Get the ticket type to verify ownership
  const { data: ticketType } = await supabase.from("ticket_types").select("event_id").eq("id", id).single()

  if (!ticketType) {
    return { error: "Ticket type not found" }
  }

  // Verify the user is the event organizer
  const { data: event } = await supabase.from("events").select("organizer_id").eq("id", ticketType.event_id).single()

  if (!event || event.organizer_id !== user.id) {
    return { error: "You do not have permission to update this ticket type" }
  }

  // Update the ticket type
  const { error } = await supabase
    .from("ticket_types")
    .update({
      name,
      description,
      price,
      quantity,
      max_per_order: maxPerOrder,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/events/${ticketType.event_id}/edit`)
  return { success: true }
}

export async function deleteTicketType(id: string) {
  const supabase = createActionClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to delete a ticket type" }
  }

  // Get the ticket type to verify ownership
  const { data: ticketType } = await supabase.from("ticket_types").select("event_id").eq("id", id).single()

  if (!ticketType) {
    return { error: "Ticket type not found" }
  }

  // Verify the user is the event organizer
  const { data: event } = await supabase.from("events").select("organizer_id").eq("id", ticketType.event_id).single()

  if (!event || event.organizer_id !== user.id) {
    return { error: "You do not have permission to delete this ticket type" }
  }

  // Delete the ticket type
  const { error } = await supabase.from("ticket_types").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/events/${ticketType.event_id}/edit`)
  return { success: true }
}

export async function purchaseTicket(ticketTypeId: string, quantity: number) {
  const supabase = createActionClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to purchase tickets" }
  }

  // Get the ticket type
  const { data: ticketType } = await supabase
    .from("ticket_types")
    .select("*, events(*)")
    .eq("id", ticketTypeId)
    .single()

  if (!ticketType) {
    return { error: "Ticket type not found" }
  }

  // Check if there are enough tickets available
  if (ticketType.quantity < quantity) {
    return { error: "Not enough tickets available" }
  }

  // Start a transaction
  const { error: transactionError } = await supabase.rpc("begin_transaction")

  if (transactionError) {
    return { error: "Failed to start transaction" }
  }

  try {
    // Create tickets
    const tickets = []
    for (let i = 0; i < quantity; i++) {
      const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .insert({
          ticket_type_id: ticketTypeId,
          event_id: ticketType.event_id,
          user_id: user.id,
          status: "active",
        })
        .select()
        .single()

      if (ticketError) {
        throw new Error(ticketError.message)
      }

      tickets.push(ticket)
    }

    // Create transaction record
    const totalAmount = ticketType.price * quantity
    const { error: transactionRecordError } = await supabase.from("transactions").insert({
      user_id: user.id,
      event_id: ticketType.event_id,
      ticket_id: tickets[0].id, // Reference the first ticket
      type: "purchase",
      amount: totalAmount,
      status: "completed",
    })

    if (transactionRecordError) {
      throw new Error(transactionRecordError.message)
    }

    // Update ticket type quantity
    const { error: updateError } = await supabase
      .from("ticket_types")
      .update({
        quantity: ticketType.quantity - quantity,
      })
      .eq("id", ticketTypeId)

    if (updateError) {
      throw new Error(updateError.message)
    }

    // Commit transaction
    const { error: commitError } = await supabase.rpc("commit_transaction")

    if (commitError) {
      throw new Error(commitError.message)
    }

    revalidatePath(`/events/${ticketType.event_id}`)
    revalidatePath("/tickets")
    return { success: true, tickets }
  } catch (error) {
    // Rollback transaction
    await supabase.rpc("rollback_transaction")
    return { error: error.message }
  }
}

export async function getUserTickets(userId: string) {
  const supabase = createActionClient()

  const { data, error } = await supabase
    .from("tickets")
    .select(`
      *,
      ticket_types(*),
      events(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user tickets:", error)
    return []
  }

  return data
}

export async function transferTicket(ticketId: string, recipientEmail: string) {
  const supabase = createActionClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to transfer a ticket" }
  }

  // Get the ticket to verify ownership
  const { data: ticket } = await supabase.from("tickets").select("*").eq("id", ticketId).eq("user_id", user.id).single()

  if (!ticket) {
    return { error: "Ticket not found or you do not own this ticket" }
  }

  // Find the recipient user
  const { data: recipientUser } = await supabase.from("profiles").select("id").eq("email", recipientEmail).single()

  if (!recipientUser) {
    return { error: "Recipient user not found" }
  }

  // Update the ticket
  const { error } = await supabase
    .from("tickets")
    .update({
      user_id: recipientUser.id,
      status: "transferred",
    })
    .eq("id", ticketId)

  if (error) {
    return { error: error.message }
  }

  // Create transaction record
  const { error: transactionError } = await supabase.from("transactions").insert({
    user_id: user.id,
    event_id: ticket.event_id,
    ticket_id: ticketId,
    type: "transfer",
    amount: 0, // No cost for transfer
    status: "completed",
  })

  if (transactionError) {
    return { error: transactionError.message }
  }

  revalidatePath("/tickets")
  return { success: true }
}
