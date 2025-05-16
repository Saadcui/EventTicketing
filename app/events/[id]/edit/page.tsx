import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserEvents } from "@/lib/actions"
import EditEventForm from "@/components/events/edit-event-form"
import { notFound } from "next/navigation"

export default async function EditEventPage({ params }: { params: { id: string } }) {
  // In a real app, you would get the user ID from the session
  const userId = "user-1"

  // Get all user events
  const events = await getUserEvents(userId)

  // Find the specific event
  const event = events.find((e) => e.id === params.id)

  // If event not found or doesn't belong to user, return 404
  if (!event) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Event</CardTitle>
            <CardDescription>Update your event details and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <EditEventForm event={event} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
