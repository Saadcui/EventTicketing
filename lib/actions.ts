"use server"

import { revalidatePath } from "next/cache"

// Types
export interface Event {
  id: string
  title: string
  date: string
  status: "Draft" | "On Sale" | "Upcoming" | "Completed" | "Canceled"
  ticketsSold: number
  totalCapacity: number
  revenue: number
  organizerId: string
  createdAt: Date
  updatedAt: Date
}

export interface Ticket {
  id: string
  eventId: string
  type: string
  price: number
  quantity: number
  sold: number
  available: number
}

export interface DashboardMetrics {
  totalRevenue: number
  ticketsSold: number
  activeEvents: number
  totalAttendees: number
  revenueChange: number
  ticketsChange: number
  attendeesChange: number
}

// Mock database - in a real app, this would be a database connection
let events: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2025",
    date: "June 15, 2025",
    status: "On Sale",
    ticketsSold: 450,
    totalCapacity: 1000,
    revenue: 44550,
    organizerId: "user-1",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    title: "Summer Music Festival",
    date: "July 10-12, 2025",
    status: "Draft",
    ticketsSold: 0,
    totalCapacity: 5000,
    revenue: 0,
    organizerId: "user-1",
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-02-10"),
  },
  {
    id: "3",
    title: "Blockchain Summit",
    date: "August 5, 2025",
    status: "On Sale",
    ticketsSold: 320,
    totalCapacity: 800,
    revenue: 63680,
    organizerId: "user-1",
    createdAt: new Date("2025-03-05"),
    updatedAt: new Date("2025-03-05"),
  },
  {
    id: "4",
    title: "Art Exhibition",
    date: "September 20, 2025",
    status: "Upcoming",
    ticketsSold: 75,
    totalCapacity: 300,
    revenue: 1875,
    organizerId: "user-1",
    createdAt: new Date("2025-04-20"),
    updatedAt: new Date("2025-04-20"),
  },
]

let tickets: Ticket[] = [
  {
    id: "1",
    eventId: "1",
    type: "Early Bird",
    price: 79,
    quantity: 200,
    sold: 200,
    available: 0,
  },
  {
    id: "2",
    eventId: "1",
    type: "Standard",
    price: 99,
    quantity: 600,
    sold: 200,
    available: 400,
  },
  {
    id: "3",
    eventId: "1",
    type: "VIP",
    price: 149,
    quantity: 200,
    sold: 50,
    available: 150,
  },
  {
    id: "4",
    eventId: "3",
    type: "Early Bird",
    price: 149,
    quantity: 300,
    sold: 300,
    available: 0,
  },
  {
    id: "5",
    eventId: "3",
    type: "Standard",
    price: 199,
    quantity: 400,
    sold: 20,
    available: 380,
  },
  {
    id: "6",
    eventId: "3",
    type: "VIP",
    price: 299,
    quantity: 100,
    sold: 0,
    available: 100,
  },
]

// Get dashboard metrics for the current user
export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  // In a real app, you would fetch this from your database
  const userEvents = events.filter((event) => event.organizerId === userId)

  const totalRevenue = userEvents.reduce((sum, event) => sum + event.revenue, 0)
  const ticketsSold = userEvents.reduce((sum, event) => sum + event.ticketsSold, 0)
  const activeEvents = userEvents.filter((event) => event.status === "On Sale" || event.status === "Upcoming").length
  const totalAttendees = ticketsSold // In a real app, this might be different from tickets sold

  // Calculate month-over-month changes (mock data for demo)
  const revenueChange = 12.5
  const ticketsChange = 8.2
  const attendeesChange = 15.3

  return {
    totalRevenue,
    ticketsSold,
    activeEvents,
    totalAttendees,
    revenueChange,
    ticketsChange,
    attendeesChange,
  }
}

// Get all events for the current user
export async function getUserEvents(userId: string): Promise<Event[]> {
  // In a real app, you would fetch this from your database
  return events.filter((event) => event.organizerId === userId)
}

// Get ticket types for an event
export async function getEventTickets(eventId: string): Promise<Ticket[]> {
  return tickets.filter((ticket) => ticket.eventId === eventId)
}

// Get ticket sales data for charts
export async function getTicketSalesData(userId: string) {
  // This would be fetched from your database in a real app
  const userEvents = events.filter((event) => event.organizerId === userId)
  const eventTickets = userEvents.flatMap((event) => tickets.filter((ticket) => ticket.eventId === event.id))

  // Aggregate ticket types for pie chart
  const ticketTypeData = eventTickets.reduce(
    (acc, ticket) => {
      const existingType = acc.find((t) => t.name === ticket.type)
      if (existingType) {
        existingType.value += ticket.sold
      } else {
        acc.push({
          name: ticket.type,
          value: ticket.sold,
          color: ticket.type === "VIP" ? "#8884d8" : ticket.type === "Standard" ? "#82ca9d" : "#ffc658",
        })
      }
      return acc
    },
    [] as { name: string; value: number; color: string }[],
  )

  // Generate sales data for line chart (mock data for demo)
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

// Update event
export async function updateEvent(eventData: Partial<Event> & { id: string }) {
  // In a real app, you would update this in your database
  const eventIndex = events.findIndex((e) => e.id === eventData.id)

  if (eventIndex === -1) {
    throw new Error("Event not found")
  }

  events[eventIndex] = {
    ...events[eventIndex],
    ...eventData,
    updatedAt: new Date(),
  }

  revalidatePath("/dashboard")
  return events[eventIndex]
}

// Delete event
export async function deleteEvent(eventId: string) {
  // In a real app, you would delete this from your database
  const eventIndex = events.findIndex((e) => e.id === eventId)

  if (eventIndex === -1) {
    throw new Error("Event not found")
  }

  events = events.filter((e) => e.id !== eventId)

  // Also delete associated tickets
  tickets = tickets.filter((t) => t.eventId !== eventId)

  revalidatePath("/dashboard")
  return { success: true }
}

// Create new event
export async function createEvent(eventData: Omit<Event, "id" | "createdAt" | "updatedAt">) {
  // In a real app, you would create this in your database
  const newEvent: Event = {
    ...eventData,
    id: `event-${events.length + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  events.push(newEvent)

  revalidatePath("/dashboard")
  return newEvent
}

// Update ticket type
export async function updateTicketType(ticketData: Partial<Ticket> & { id: string }) {
  // In a real app, you would update this in your database
  const ticketIndex = tickets.findIndex((t) => t.id === ticketData.id)

  if (ticketIndex === -1) {
    throw new Error("Ticket type not found")
  }

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    ...ticketData,
  }

  // Update event revenue and tickets sold if necessary
  if (ticketData.sold !== undefined) {
    const eventId = tickets[ticketIndex].eventId
    const eventIndex = events.findIndex((e) => e.id === eventId)

    if (eventIndex !== -1) {
      const eventTickets = tickets.filter((t) => t.eventId === eventId)
      const totalSold = eventTickets.reduce((sum, t) => sum + t.sold, 0)
      const totalRevenue = eventTickets.reduce((sum, t) => sum + t.price * t.sold, 0)

      events[eventIndex] = {
        ...events[eventIndex],
        ticketsSold: totalSold,
        revenue: totalRevenue,
        updatedAt: new Date(),
      }
    }
  }

  revalidatePath("/dashboard")
  return tickets[ticketIndex]
}
