import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Zap, Shield, Sparkles } from "lucide-react"
import EventCard from "@/components/event-card"
import CategorySection from "@/components/category-section"
import HeroSection from "@/components/hero-section"
import { createServerClient } from "@/lib/supabase/server"
import { Suspense } from "react"

export default async function HomePage() {
  const supabase = createServerClient()

  // Fetch trending events from the database
  const { data: trendingEvents, error } = await supabase
    .from("events")
    .select("*")
    .in("status", ["on_sale", "upcoming"])
    .order("created_at", { ascending: false })
    .limit(4)

  if (error) {
    console.error("Error fetching trending events:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
        {/* Features section */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Why BlockTix?</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Our platform combines the security of blockchain with the convenience of modern ticketing
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Blockchain Security</h3>
                    <p className="text-muted-foreground">
                      Every ticket is secured as an NFT on the blockchain, eliminating fraud and unauthorized resales
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">AI-Powered Insights</h3>
                    <p className="text-muted-foreground">
                      Personalized event recommendations and smart pricing suggestions for organizers
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Seamless Experience</h3>
                    <p className="text-muted-foreground">
                      Easy-to-use platform for both attendees and organizers with powerful management tools
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trending events section */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" /> Trending Events
                </h2>
                <p className="mt-2 text-muted-foreground">Discover the hottest events happening soon</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/discover">View all</Link>
              </Button>
            </div>

            <Tabs defaultValue="all" className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Music">Music</TabsTrigger>
                <TabsTrigger value="Conference">Conferences</TabsTrigger>
                <TabsTrigger value="Sports">Sports</TabsTrigger>
                <TabsTrigger value="Arts">Arts & Theater</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trendingEvents && trendingEvents.length > 0 ? (
                    trendingEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={{
                          id: event.id,
                          title: event.title,
                          image: event.image_url || "/placeholder.svg?height=400&width=600",
                          date: event.date,
                          location: event.location,
                          price: "From $99", // This should come from ticket types
                          category: event.category,
                        }}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p>No events found.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="Music" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trendingEvents && trendingEvents.filter((event) => event.category === "Music").length > 0 ? (
                    trendingEvents
                      .filter((event) => event.category === "Music")
                      .map((event) => (
                        <EventCard
                          key={event.id}
                          event={{
                            id: event.id,
                            title: event.title,
                            image: event.image_url || "/placeholder.svg?height=400&width=600",
                            date: event.date,
                            location: event.location,
                            price: "From $99", // This should come from ticket types
                            category: event.category,
                          }}
                        />
                      ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p>No Music events found.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              {/* Other tabs would have similar content */}
            </Tabs>
          </div>
        </section>

        {/* Categories section */}
        <CategorySection />

        {/* CTA section */}
        <section className="py-12 md:py-16 bg-primary text-primary-foreground">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                <h2 className="text-3xl font-bold tracking-tight">Ready to host your event?</h2>
                <p className="mt-4">Create your event in minutes and start selling blockchain-secured tickets today.</p>
              </div>
              <div className="flex gap-4">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/create">Create Event</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent">
                  <Link href="/learn-more">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Suspense>
    </div>
  )
}
