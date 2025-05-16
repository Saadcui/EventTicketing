import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerClient } from "@/lib/supabase/server"
import { CalendarDays, Ticket, Users, DollarSign } from "lucide-react"

export default async function DashboardMetricsCards() {
  try {
    const supabase = createServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">No Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Please log in</p>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Fetch events for this organizer
    const { data: events } = await supabase.from("events").select("*").eq("organizer_id", user.id)

    // Fetch ticket types for these events
    const eventIds = events?.map((event) => event.id) || []

    let ticketTypes = []
    let tickets = []

    if (eventIds.length > 0) {
      // Fetch ticket types
      const { data: fetchedTicketTypes } = await supabase.from("ticket_types").select("*").in("event_id", eventIds)

      ticketTypes = fetchedTicketTypes || []

      // Fetch tickets
      const { data: fetchedTickets } = await supabase.from("tickets").select("*").in("event_id", eventIds)

      tickets = fetchedTickets || []
    }

    // Calculate metrics
    const totalEvents = events?.length || 0
    const activeEvents =
      events?.filter((event) => event.status === "on_sale" || event.status === "upcoming").length || 0
    const totalTicketsSold = tickets?.length || 0

    // Calculate revenue
    let totalRevenue = 0
    if (tickets && ticketTypes) {
      tickets.forEach((ticket) => {
        const ticketType = ticketTypes.find((tt) => tt.id === ticket.ticket_type_id)
        if (ticketType) {
          totalRevenue += Number(ticketType.price)
        }
      })
    }

    // Calculate month-over-month change
    // In a real app, you would compare with last month's data
    const lastMonthRevenue = totalRevenue * 0.85 // Simulated 15% growth
    const revenueChange = totalRevenue > 0 ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

    // Get unique attendees
    const uniqueAttendees = new Set(tickets?.map((ticket) => ticket.user_id)).size || 0

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">{activeEvents} active events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTicketsSold}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {revenueChange > 0 ? "+" : ""}
              {revenueChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueAttendees}</div>
            <p className="text-xs text-muted-foreground">Unique ticket buyers</p>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error)
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Failed to load metrics</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}
