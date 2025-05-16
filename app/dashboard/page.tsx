"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Ticket, Calendar, DollarSign } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [events, setEvents] = useState([])
  const [ticketsSold, setTicketsSold] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Check if user is authenticated
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)
        const userId = sessionData.session.user.id

        // Fetch user's events
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("organizer_id", userId)
          .order("created_at", { ascending: false })

        if (eventsError) {
          console.error("Error fetching events:", eventsError)
        } else {
          setEvents(eventsData || [])

          // Get event IDs for ticket queries
          const eventIds = eventsData?.map((event) => event.id) || []

          if (eventIds.length > 0) {
            // Fetch tickets for these events
            const { data: ticketsData, error: ticketsError } = await supabase
              .from("tickets")
              .select(`
                *,
                ticket_types(price)
              `)
              .in("event_id", eventIds)

            if (ticketsError) {
              console.error("Error fetching tickets:", ticketsError)
            } else {
              setTicketsSold(ticketsData?.length || 0)

              // Calculate revenue
              const revenue =
                ticketsData?.reduce((total, ticket) => {
                  return total + (ticket.ticket_types?.price || 0)
                }, 0) || 0

              setTotalRevenue(revenue)
            }
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Dashboard error:", error)
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You need to be logged in to view the dashboard.</p>
            <Button asChild>
              <Link href="/auth/login?redirect=/dashboard">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and view analytics</p>
        </div>
        <Button asChild>
          <Link href="/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events?.filter((e) => e.status === "on_sale" || e.status === "upcoming").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketsSold}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Event</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b">
                      <td className="p-2">{event.title}</td>
                      <td className="p-2">{event.date}</td>
                      <td className="p-2">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {event.status || "Draft"}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/events/${event.id}`}>View</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/events/${event.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">You haven't created any events yet.</p>
              <Button asChild>
                <Link href="/create">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Event
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
