"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, MapPin, Share2, Heart, Users } from "lucide-react"
import Image from "next/image"
import { PurchaseTicketForm } from "@/components/events/purchase-ticket-form"

export default function EventPage() {
  const params = useParams()
  const eventId = params.id as string
  const [event, setEvent] = useState(null)
  const [ticketTypes, setTicketTypes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchEventData() {
      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select(`
            *,
            profiles(id, full_name, avatar_url)
          `)
          .eq("id", eventId)
          .single()

        if (eventError) {
          console.error("Error fetching event:", eventError)
          setIsLoading(false)
          return
        }

        setEvent(eventData)

        // Fetch ticket types for this event
        const { data: ticketTypesData, error: ticketTypesError } = await supabase
          .from("ticket_types")
          .select("*")
          .eq("event_id", eventId)
          .order("price", { ascending: true })

        if (ticketTypesError) {
          console.error("Error fetching ticket types:", ticketTypesError)
        } else {
          setTicketTypes(ticketTypesData || [])
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching event data:", error)
        setIsLoading(false)
      }
    }

    if (eventId) {
      fetchEventData()
    }
  }, [eventId])

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-medium mb-2">Event Not Found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <a href="/discover">Discover Events</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
            <Image
              src={event.image_url || "/placeholder.svg?height=600&width=1200"}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center">
                <CalendarDays className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center">
                <Clock className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">{event.time || "TBA"}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="about" className="mb-8">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{event.description || "No description provided."}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="schedule" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Schedule details will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="location" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{event.location}</p>
                  {event.address && <p className="text-muted-foreground">{event.address}</p>}
                  <div className="mt-4 aspect-video bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Map will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {event.profiles?.avatar_url ? (
                    <Image
                      src={event.profiles.avatar_url || "/placeholder.svg"}
                      alt={event.profiles.full_name || "Organizer"}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <Users className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{event.profiles?.full_name || "Event Organizer"}</p>
                  <p className="text-sm text-muted-foreground">Organizer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
              <CardDescription>Secure your spot at this event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ticketTypes.length > 0 ? (
                ticketTypes.map((ticketType) => (
                  <PurchaseTicketForm
                    key={ticketType.id}
                    eventId={event.id}
                    ticketTypeId={ticketType.id}
                    ticketName={ticketType.name}
                    ticketPrice={ticketType.price}
                    maxQuantity={ticketType.quantity}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No tickets available for this event yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
