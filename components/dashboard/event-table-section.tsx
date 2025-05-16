import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import EventTable from "@/components/dashboard/event-table"
import { createServerClient } from "@/lib/supabase/server"

export default async function EventTableSection() {
  const supabase = createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch events for this organizer
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching events:", error)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Events</CardTitle>
          <CardDescription>Manage your events and track their performance</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading events...</div>}>
          <EventTable events={events || []} />
        </Suspense>
      </CardContent>
    </Card>
  )
}
