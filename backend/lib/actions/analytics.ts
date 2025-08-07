"use server"

import { createServerSupabaseClient } from "../supabase/server"
import { getUserDetails } from "../auth"

export async function getEventAnalytics(eventId: string) {
  const user = await getUserDetails()

  if (!user) {
    return null
  }

  const supabase = createServerSupabaseClient()

  // Check if the user is the organizer of this event
  const { data: event } = await supabase.from("events").select("organizer_id, capacity").eq("id", eventId).single()

  if (!event || (event.organizer_id !== user.id && user.role !== "admin")) {
    return null
  }

  // Get ticket sales
  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("purchase_date, price")
    .eq("event_id", eventId)

  if (ticketsError) {
    console.error("Error fetching tickets:", ticketsError)
    return null
  }

  // Calculate total sales
  const totalSales = tickets.reduce((sum, ticket) => sum + ticket.price, 0)

  // Calculate tickets sold
  const ticketsSold = tickets.length

  // Calculate remaining capacity
  const remainingCapacity = event.capacity - ticketsSold

  // Group sales by date
  const salesByDate = tickets.reduce((acc: Record<string, number>, ticket) => {
    const date = new Date(ticket.purchase_date).toISOString().split("T")[0]
    acc[date] = (acc[date] || 0) + ticket.price
    return acc
  }, {})

  // Convert to array for charting
  const salesChartData = Object.entries(salesByDate).map(([date, amount]) => ({
    date,
    amount,
  }))

  return {
    totalSales,
    ticketsSold,
    remainingCapacity,
    salesChartData,
  }
}

export async function getOrganizerAnalytics() {
  const user = await getUserDetails()

  if (!user) {
    return null
  }

  const supabase = createServerSupabaseClient()

  // Get all events by this organizer
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("id, title, capacity")
    .eq("organizer_id", user.id)

  if (eventsError) {
    console.error("Error fetching events:", eventsError)
    return null
  }

  // Get all tickets for these events
  const eventIds = events.map((event) => event.id)

  if (eventIds.length === 0) {
    return {
      totalEvents: 0,
      totalTicketsSold: 0,
      totalSales: 0,
      eventPerformance: [],
      salesByDay: [],
    }
  }

  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("event_id, purchase_date, price")
    .in("event_id", eventIds)

  if (ticketsError) {
    console.error("Error fetching tickets:", ticketsError)
    return null
  }

  // Calculate total sales
  const totalSales = tickets.reduce((sum, ticket) => sum + ticket.price, 0)

  // Calculate total tickets sold
  const totalTicketsSold = tickets.length

  // Calculate performance by event
  const ticketsByEvent = tickets.reduce((acc: Record<string, number>, ticket) => {
    acc[ticket.event_id] = (acc[ticket.event_id] || 0) + 1
    return acc
  }, {})

  const salesByEvent = tickets.reduce((acc: Record<string, number>, ticket) => {
    acc[ticket.event_id] = (acc[ticket.event_id] || 0) + ticket.price
    return acc
  }, {})

  const eventPerformance = events.map((event) => ({
    id: event.id,
    title: event.title,
    ticketsSold: ticketsByEvent[event.id] || 0,
    sales: salesByEvent[event.id] || 0,
    capacity: event.capacity,
    percentageSold: Math.round(((ticketsByEvent[event.id] || 0) / event.capacity) * 100),
  }))

  // Group sales by day
  const salesByDay = tickets.reduce((acc: Record<string, number>, ticket) => {
    const date = new Date(ticket.purchase_date).toISOString().split("T")[0]
    acc[date] = (acc[date] || 0) + ticket.price
    return acc
  }, {})

  // Convert to array for charting
  const salesChartData = Object.entries(salesByDay).map(([date, amount]) => ({
    date,
    amount,
  }))

  return {
    totalEvents: events.length,
    totalTicketsSold,
    totalSales,
    eventPerformance,
    salesByDay: salesChartData,
  }
}
