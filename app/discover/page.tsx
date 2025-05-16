import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, MapPin } from "lucide-react"

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerClient()

  // Get search parameters
  const query = typeof searchParams.query === "string" ? searchParams.query : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : ""
  const location = typeof searchParams.location === "string" ? searchParams.location : ""

  // Fetch events from database
  let eventsQuery = supabase.from("events").select("*").order("date", { ascending: true })

  // Apply filters if provided
  if (query) {
    eventsQuery = eventsQuery.ilike("title", `%${query}%`)
  }
  if (category) {
    eventsQuery = eventsQuery.eq("category", category)
  }
  if (location) {
    eventsQuery = eventsQuery.ilike("location", `%${location}%`)
  }

  const { data: events, error } = await eventsQuery

  if (error) {
    console.error("Error fetching events:", error)
  }

  // Get unique categories for filter
  const { data: categories } = await supabase.from("events").select("category").order("category")
  const uniqueCategories = Array.from(new Set(categories?.map((item) => item.category) || []))

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Events</h1>
          <p className="text-muted-foreground">Find and attend events that interest you</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="query" className="text-sm font-medium">
                Search
              </label>
              <Input id="query" name="query" placeholder="Search events..." defaultValue={query} />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                defaultValue={category}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input id="location" name="location" placeholder="Any location" defaultValue={location} />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id} className="group">
              <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow transition-all hover:shadow-md">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={event.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No events found</h2>
          <p className="text-muted-foreground mb-6">
            {query || category || location
              ? "Try adjusting your search filters"
              : "There are no events available at the moment"}
          </p>
          <Button asChild>
            <Link href="/create">Create an Event</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
