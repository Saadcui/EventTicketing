"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface EventCardProps {
  event: {
    id: string
    title: string
    image: string
    date: string
    location: string
    price: string
    category?: string
  }
}

export default function EventCard({ event }: EventCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    async function checkFavoriteStatus() {
      try {
        const { data: session } = await supabase.auth.getSession()

        if (!session.session) {
          setIsAuthenticated(false)
          return
        }

        setIsAuthenticated(true)

        // Check if favorites table exists
        const { error: tableError } = await supabase.from("favorites").select("count").limit(1).throwOnError()

        if (tableError) {
          console.error("Favorites table might not exist:", tableError)
          return
        }

        // Check if this event is in user's favorites
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", session.session.user.id)
          .eq("event_id", event.id)
          .single()

        if (error && error.code !== "PGRST116") {
          console.error("Error checking favorite status:", error)
          return
        }

        setIsFavorite(!!data)
      } catch (error) {
        console.error("Error checking auth or favorites:", error)
      }
    }

    checkFavoriteStatus()
  }, [event.id])

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      // Store the current URL to redirect back after login
      localStorage.setItem("returnUrl", window.location.pathname)

      // Redirect to login
      window.location.href = "/auth/login"
      return
    }

    setIsLoading(true)

    try {
      const { data: session } = await supabase.auth.getSession()

      if (!session.session) {
        setIsLoading(false)
        return
      }

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", session.session.user.id)
          .eq("event_id", event.id)

        if (error) {
          console.error("Error removing favorite:", error)
          toast({
            title: "Error",
            description: "Could not remove from favorites",
            variant: "destructive",
          })
          return
        }

        setIsFavorite(false)
        toast({
          title: "Removed from favorites",
          description: "Event removed from your favorites",
        })
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: session.session.user.id,
          event_id: event.id,
          created_at: new Date().toISOString(),
        })

        if (error) {
          console.error("Error adding favorite:", error)
          toast({
            title: "Error",
            description: "Could not add to favorites",
            variant: "destructive",
          })
          return
        }

        setIsFavorite(true)
        toast({
          title: "Added to favorites",
          description: "Event added to your favorites",
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full z-10 hover:bg-background/90 ${
            isFavorite ? "text-red-500" : ""
          }`}
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
        </Button>
        {event.category && <Badge className="absolute top-2 left-2 z-10">{event.category}</Badge>}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 mb-2">
          <Link href={`/events/${event.id}`} className="hover:underline">
            {event.title}
          </Link>
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <CalendarDays className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="font-medium">{event.price}</span>
        <Button asChild size="sm">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
