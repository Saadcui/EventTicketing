import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CreateEventForm from "@/components/events/create-event-form"

export default function CreateEventPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>Fill in the details to create your blockchain-secured event</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateEventForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
