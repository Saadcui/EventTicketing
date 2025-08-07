"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/backend/lib/supabase/client"
import { useToast } from "@/frontend/hooks/use-toast"
import DashboardMetricsCards from "./dashboard-metrics-cards"
import DashboardChartSection from "./dashboard-chart-section"
import EventTableSection from "./event-table-section"
import AiInsightsSection from "./ai-insights-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardClient() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error("User not authenticated")
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) throw profileError

        // Get user's events
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("organizer_id", user.id)

        if (eventsError) throw eventsError

        // Get user's tickets
        const { data: ticketsData, error: ticketsError } = await supabase
          .from("tickets")
          .select("*, events(*)")
          .eq("user_id", user.id)

        if (ticketsError) throw ticketsError

        setUserData(profile)
        setEvents(eventsData || [])
        setTickets(ticketsData || [])
      } catch (error: any) {
        console.error("Error loading dashboard data:", error)
        toast({
          title: "Error loading dashboard",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [supabase, toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">My Events</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <DashboardMetricsCards
            eventsCount={events.length}
            ticketsCount={tickets.length}
            revenue={events.reduce((acc, event) => acc + (event.revenue || 0), 0)}
            attendeesCount={events.reduce((acc, event) => acc + (event.attendees_count || 0), 0)}
          />
          <DashboardChartSection events={events} />
          <EventTableSection events={events} />
        </TabsContent>
        <TabsContent value="events" className="space-y-6">
          <EventTableSection events={events} />
        </TabsContent>
        <TabsContent value="insights" className="space-y-6">
          <AiInsightsSection events={events} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
