"use server"

import { createServerSupabaseClient } from "../supabase/server"
import { revalidatePath } from "next/cache"
import { getUserDetails } from "../auth"

export async function getUserTickets() {
  const user = await getUserDetails()

  if (!user) {
    return []
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("tickets")
    .select("*, events(*)")
    .eq("user_id", user.id)
    .order("purchase_date", { ascending: false })

  if (error) {
    console.error("Error fetching user tickets:", error)
    return []
  }

  return data
}

export async function getEventTickets(eventId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("tickets")
    .select("*, profiles(username, full_name)")
    .eq("event_id", eventId)
    .order("purchase_date", { ascending: false })

  if (error) {
    console.error("Error fetching event tickets:", error)
    return []
  }

  return data
}

export async function purchaseTicket(formData: FormData) {
  const user = await getUserDetails()

  if (!user) {
    return { error: "You must be logged in to purchase a ticket" }
  }

  const eventId = formData.get("eventId") as string
  const ticketType = formData.get("ticketType") as string
  const price = Number.parseFloat(formData.get("price") as string)

  const supabase = createServerSupabaseClient()

  // Check if the event exists and has capacity
  const { data: event } = await supabase.from("events").select("capacity").eq("id", eventId).single()

  if (!event) {
    return { error: "Event not found" }
  }

  // Count existing tickets for this event
  const { count } = await supabase.from("tickets").select("*", { count: "exact" }).eq("event_id", eventId)

  if (count && count >= event.capacity) {
    return { error: "Event is sold out" }
  }

  // Create the ticket
  const { error } = await supabase.from("tickets").insert({
    event_id: eventId,
    user_id: user.id,
    ticket_type: ticketType,
    price,
    is_used: false,
    purchase_date: new Date().toISOString(),
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/events/${eventId}`)
  revalidatePath("/tickets")

  return { success: true }
}

export async function useTicket(ticketId: string) {
  const user = await getUserDetails()

  if (!user) {
    return { error: "You must be logged in to use a ticket" }
  }

  const supabase = createServerSupabaseClient()

  // Check if the user owns this ticket
  const { data: ticket } = await supabase.from("tickets").select("user_id, is_used").eq("id", ticketId).single()

  if (!ticket) {
    return { error: "Ticket not found" }
  }

  if (ticket.user_id !== user.id && user.role !== "admin" && user.role !== "organizer") {
    return { error: "You do not have permission to use this ticket" }
  }

  if (ticket.is_used) {
    return { error: "Ticket has already been used" }
  }

  const { error } = await supabase.from("tickets").update({ is_used: true }).eq("id", ticketId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/tickets")

  return { success: true }
}
