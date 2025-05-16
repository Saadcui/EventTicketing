import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerClient } from "@/lib/supabase/server"
import { BarChart, LineChart } from "@/components/ui/chart"

export default async function DashboardChartSection() {
  try {
    const supabase = createServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    // Fetch events for this organizer
    const { data: events } = await supabase.from("events").select("*").eq("organizer_id", user.id)
    const eventIds = events?.map((event) => event.id) || []

    // Prepare data for charts
    let ticketsByEvent = []
    const salesByMonth = {}

    if (eventIds.length > 0) {
      // Fetch tickets with their types
      const { data: tickets } = await supabase
        .from("tickets")
        .select(`
          *,
          ticket_types(price),
          events(title)
        `)
        .in("event_id", eventIds)

      if (tickets) {
        // Process tickets for event performance chart
        const eventTicketCounts = {}
        tickets.forEach((ticket) => {
          const eventTitle = ticket.events?.title || "Unknown Event"
          eventTicketCounts[eventTitle] = (eventTicketCounts[eventTitle] || 0) + 1
        })

        ticketsByEvent = Object.entries(eventTicketCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) // Top 5 events

        // Process tickets for sales by month chart
        tickets.forEach((ticket) => {
          const purchaseDate = new Date(ticket.purchase_date)
          const monthYear = `${purchaseDate.getFullYear()}-${String(purchaseDate.getMonth() + 1).padStart(2, "0")}`
          const price = ticket.ticket_types?.price || 0

          if (!salesByMonth[monthYear]) {
            salesByMonth[monthYear] = { tickets: 0, revenue: 0 }
          }

          salesByMonth[monthYear].tickets += 1
          salesByMonth[monthYear].revenue += Number(price)
        })
      }
    }

    // Format data for charts
    const salesData = {
      labels: Object.keys(salesByMonth)
        .sort()
        .map((monthYear) => {
          const [year, month] = monthYear.split("-")
          const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
          return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        }),
      datasets: [
        {
          label: "Revenue",
          data: Object.keys(salesByMonth)
            .sort()
            .map((monthYear) => salesByMonth[monthYear].revenue),
        },
      ],
    }

    const eventData = {
      labels: ticketsByEvent.map((item) => item.name),
      datasets: [
        {
          label: "Tickets Sold",
          data: ticketsByEvent.map((item) => item.count),
        },
      ],
    }

    // If no data, provide sample data
    if (Object.keys(salesByMonth).length === 0) {
      salesData.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      salesData.datasets[0].data = [0, 0, 0, 0, 0, 0]
    }

    if (ticketsByEvent.length === 0) {
      eventData.labels = ["No Events"]
      eventData.datasets[0].data = [0]
    }

    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly ticket sales revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart data={salesData} />
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Event Performance</CardTitle>
            <CardDescription>Tickets sold by event</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart data={eventData} />
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load chart data</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <p>An error occurred while loading chart data</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}
