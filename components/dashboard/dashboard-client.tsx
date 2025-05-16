"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DashboardClient() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getSession() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth error:", error)
          return
        }

        if (!data.session) {
          return
        }

        setUser(data.session.user)

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("organizer_id", data.session.user.id)
          .order("created_at", { ascending: false })

        if (eventsError) {
          console.error("Error fetching events:", eventsError)
        } else if (eventsData) {
          setEvents(eventsData)
        }
      } catch (error) {
        console.error("Dashboard client error:", error)
      } finally {
        setLoading(false)
      }
    }

    getSession()
  }, [supabase])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events?.filter((e) => e.status === "active" || e.status === "upcoming").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
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
