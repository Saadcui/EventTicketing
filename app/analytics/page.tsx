"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart, Download, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    totalAttendees: 0,
    eventsHosted: 0,
    revenueChange: 0,
    categoryData: [],
    eventPerformance: [],
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchAnalyticsData() {
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

        if (eventsError) {
          console.error("Error fetching events:", eventsError)
          setIsLoading(false)
          return
        }

        // Get event IDs
        const eventIds = eventsData?.map((event) => event.id) || []
        const eventsHosted = eventsData?.length || 0

        // Initialize analytics data
        let totalRevenue = 0
        let totalAttendees = 0
        let eventPerformance = []

        // If there are events, fetch tickets and calculate metrics
        if (eventIds.length > 0) {
          // Fetch tickets for these events
          const { data: ticketsData, error: ticketsError } = await supabase
            .from("tickets")
            .select(`
              *,
              ticket_types(price),
              events(title, date, total_capacity)
            `)
            .in("event_id", eventIds)

          if (ticketsError) {
            console.error("Error fetching tickets:", ticketsError)
          } else {
            // Calculate total revenue and attendees
            totalAttendees = ticketsData?.length || 0

            totalRevenue =
              ticketsData?.reduce((total, ticket) => {
                return total + (ticket.ticket_types?.price || 0)
              }, 0) || 0

            // Create event performance data
            const eventTicketCounts = {}
            const eventRevenue = {}

            ticketsData?.forEach((ticket) => {
              const eventId = ticket.event_id
              eventTicketCounts[eventId] = (eventTicketCounts[eventId] || 0) + 1
              eventRevenue[eventId] = (eventRevenue[eventId] || 0) + (ticket.ticket_types?.price || 0)
            })

            // Format event performance data
            eventPerformance =
              eventsData?.map((event) => {
                const ticketsSold = eventTicketCounts[event.id] || 0
                const revenue = eventRevenue[event.id] || 0
                const conversionRate = event.total_capacity ? Math.round((ticketsSold / event.total_capacity) * 100) : 0

                return {
                  name: event.title,
                  date: event.date,
                  ticketsSold,
                  totalCapacity: event.total_capacity,
                  revenue,
                  conversionRate,
                }
              }) || []
          }

          // Calculate category distribution
          const categoryCount = {}
          eventsData?.forEach((event) => {
            const category = event.category || "Other"
            categoryCount[category] = (categoryCount[category] || 0) + 1
          })

          const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
            name,
            value: Math.round((Number(value) / eventsHosted) * 100),
          }))

          setAnalyticsData({
            totalRevenue,
            totalAttendees,
            eventsHosted,
            revenueChange: 12.5, // Mock data for now
            categoryData,
            eventPerformance,
          })
        } else {
          setAnalyticsData({
            totalRevenue: 0,
            totalAttendees: 0,
            eventsHosted: 0,
            revenueChange: 0,
            categoryData: [],
            eventPerformance: [],
          })
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Analytics error:", error)
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
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
            <p className="mb-4">You need to be logged in to view analytics.</p>
            <Button asChild>
              <Link href="/auth/login?redirect=/analytics">Log In</Link>
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
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Insights and trends from your events</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">+{analyticsData.revenueChange}% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalAttendees}</div>
            <p className="text-xs text-muted-foreground mt-1">+8% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Events Hosted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.eventsHosted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{analyticsData.eventsHosted > 0 ? "1" : "0"} from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="mb-8">
        <TabsList>
          <TabsTrigger value="revenue" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" /> Revenue
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <PieChart className="mr-2 h-4 w-4" /> Categories
          </TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Monthly revenue from all events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Over Time</CardTitle>
              <CardDescription>Monthly attendance across all events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Attendance chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Categories</CardTitle>
              <CardDescription>Distribution of events by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {analyticsData.categoryData.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {analyticsData.categoryData.map((category) => (
                      <div key={category.name} className="flex items-center">
                        <div className="w-32">{category.name}</div>
                        <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${category.value}%` }}></div>
                        </div>
                        <div className="w-12 text-right">{category.value}%</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No category data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
          <CardDescription>Detailed breakdown of individual event performance</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData.eventPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Event Name</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-right py-3 px-4">Tickets Sold</th>
                    <th className="text-right py-3 px-4">Revenue</th>
                    <th className="text-right py-3 px-4">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.eventPerformance.map((event, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{event.name}</td>
                      <td className="py-3 px-4">{event.date}</td>
                      <td className="text-right py-3 px-4">
                        {event.ticketsSold} / {event.totalCapacity}
                      </td>
                      <td className="text-right py-3 px-4">${event.revenue.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">{event.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">No event performance data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
