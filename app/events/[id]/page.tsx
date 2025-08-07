import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, MapPin, Share2, Heart, Users, Ticket, AlertCircle } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function EventPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Fetch event data
  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      profiles(id, full_name, avatar_url)
    `)
    .eq("id", params.id)
    .single()

  if (error || !event) {
    console.error("Error fetching event:", error)
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/discover">Browse Events</Link>
        </Button>
      </div>
    )
  }

  // Fetch ticket types
  const { data: ticketTypes } = await supabase.from("ticket_types").select("*").eq("event_id", event.id)

  // Fetch ticket stats
  const { count: ticketsSold } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("event_id", event.id)

  // Format ticket types for the ticket selection component
  const formattedTicketTypes =
    ticketTypes?.map((type) => ({
      id: type.id,
      name: type.name,
      price: type.price,
      description: type.description || "",
      available: type.quantity,
      maxPerOrder: type.max_per_order || 10,
    })) || []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Event header */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src={event.image_url || "/placeholder.svg?height=600&width=1200"}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container">
            <Badge className="mb-2">{event.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-1 h-4 w-4" />
                {event.date}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-1 h-4 w-4" />
                {event.time || "TBD"}
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-1 h-4 w-4" />
                {event.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="mb-8">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="organizer">Organizer</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: event.description || "No description provided." }} />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{event.category}</Badge>
                    {event.status === "on_sale" && <Badge variant="outline">On Sale</Badge>}
                    {event.status === "upcoming" && <Badge variant="outline">Upcoming</Badge>}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="location" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{event.location}</CardTitle>
                    <CardDescription>{event.address || "Address not provided"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Map view</span>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="organizer" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{event.profiles?.full_name || "Event Organizer"}</CardTitle>
                    <CardDescription>Event Organizer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">This event is organized by {event.profiles?.full_name || "an organizer"}.</p>
                    <Button variant="outline">View Organizer Profile</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle>Get Tickets</CardTitle>
                  <CardDescription>Secure your spot at this event</CardDescription>
                </CardHeader>
                <CardContent>
                  {formattedTicketTypes.length > 0 ? (
                    <div className="space-y-4">
                      {formattedTicketTypes.map((ticket) => (
                        <div key={ticket.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">{ticket.name}</h4>
                            <p className="text-sm text-muted-foreground">{ticket.description}</p>
                            <p className="text-sm mt-1">
                              {ticket.available} available • Max {ticket.maxPerOrder} per order
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${ticket.price.toFixed(2)}</div>
                            <Button size="sm" className="mt-2">
                              Buy Ticket
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">No tickets available for this event yet.</p>
                      <Button variant="outline" asChild>
                        <Link href="/discover">Browse Other Events</Link>
                      </Button>
                    </div>
                  )}
                  <div className="mt-4 p-3 bg-muted rounded-md flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      All tickets are secured on the blockchain as NFTs, ensuring authenticity and preventing fraud.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>

              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Event Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center">
                      <Ticket className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Tickets Sold</span>
                    </div>
                    <Badge variant="outline">
                      {ticketsSold || 0} / {event.total_capacity || 100}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Interested</span>
                    </div>
                    <Badge variant="outline">120+</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
