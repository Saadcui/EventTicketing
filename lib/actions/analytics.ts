"use server"

import { createActionClient } from "@/lib/supabase/server"

export async function getDashboardMetrics(userId: string) {
  const supabase = createActionClient()

  // Get total revenue
  const { data: revenueData, error: revenueError } = await supabase
    .from("transactions")
    .select("amount")
    .eq("type", "purchase")
    .eq("status", "completed")
    .in("event_id", (query) => {
      query.from("events").select("id").eq("organizer_id", userId)
    })

  if (revenueError) {
    console.error("Error fetching revenue:", revenueError)
    return null
  }

  const totalRevenue = revenueData.reduce((sum, transaction) => sum + transaction.amount, 0)

  // Get tickets sold
  const { data: ticketsData, error: ticketsError } = await supabase
    .from("tickets")
    .select("id")
    .in("event_id", (query) => {
      query.from("events").select("id").eq("organizer_id", userId)
    })

  if (ticketsError) {
    console.error("Error fetching tickets:", ticketsError)
    return null
  }

  const ticketsSold = ticketsData.length

  // Get active events
  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("id, status")
    .eq("organizer_id", userId)

  if (eventsError) {
    console.error("Error fetching events:", eventsError)
    return null
  }

  const activeEvents = eventsData.filter((event) => event.status === "on_sale" || event.status === "upcoming").length

  // Get total attendees (unique ticket holders)
  const { data: attendeesData, error: attendeesError } = await supabase
    .from("tickets")
    .select("user_id")
    .in("event_id", (query) => {
      query.from("events").select("id").eq("organizer_id", userId)
    })
    .order("user_id")

  if (attendeesError) {
    console.error("Error fetching attendees:", attendeesError)
    return null
  }

  // Count unique user_ids
  const uniqueAttendees = new Set(attendeesData.map((ticket) => ticket.user_id)).size

  // For demo purposes, we'll use fixed values for the changes
  const revenueChange = 12.5
  const ticketsChange = 8.2
  const attendeesChange = 15.3

  return {
    totalRevenue,
    ticketsSold,
    activeEvents,
    totalAttendees: uniqueAttendees,
    revenueChange,
    ticketsChange,
    attendeesChange,
  }
}

export async function getTicketSalesData(userId: string) {
  const supabase = createActionClient()

  // Get ticket types data for pie chart
  const { data: ticketTypesData, error: ticketTypesError } = await supabase
    .from("tickets")
    .select(`
      ticket_types(name)
    `)
    .in("event_id", (query) => {
      query.from("events").select("id").eq("organizer_id", userId)
    })

  if (ticketTypesError) {
    console.error("Error fetching ticket types:", ticketTypesError)
    return null
  }

  // Count tickets by type
  const ticketTypeCount = {}
  ticketTypesData.forEach((ticket) => {
    const typeName = ticket.ticket_types.name
    ticketTypeCount[typeName] = (ticketTypeCount[typeName] || 0) + 1
  })

  // Format for pie chart
  const ticketTypeData = Object.entries(ticketTypeCount).map(([name, value], index) => {
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"]
    return {
      name,
      value,
      color: colors[index % colors.length],
    }
  })

  // Generate sales data for line chart (mock data for demo)
  // In a real app, you would query transactions grouped by date
  const salesData = [
    { name: "May 1", tickets: 40, revenue: 2000 },
    { name: "May 5", tickets: 30, revenue: 1500 },
    { name: "May 10", tickets: 20, revenue: 1000 },
    { name: "May 15", tickets: 27, revenue: 1350 },
    { name: "May 20", tickets: 90, revenue: 4500 },
    { name: "May 25", tickets: 75, revenue: 3750 },
    { name: "May 30", tickets: 100, revenue: 5000 },
  ]

  return {
    ticketTypeData,
    salesData,
  }
}
