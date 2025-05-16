"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function seedDatabase() {
  const supabase = createActionClient()

  // Sample events data
  const events = [
    {
      title: "Tech Conference 2025",
      description:
        "Join us for the biggest tech conference of the year, featuring keynotes from industry leaders, workshops, networking opportunities, and more.",
      date: "2025-06-15",
      time: "09:00",
      location: "San Francisco Convention Center",
      address: "747 Howard St, San Francisco, CA 94103",
      category: "Conference",
      status: "upcoming",
      total_capacity: 1000,
      image_url: "/placeholder.svg?height=400&width=600",
      organizer_id: "user-1", // This should be a real user ID
    },
    {
      title: "Summer Music Festival",
      description: "A three-day music festival featuring top artists from around the world.",
      date: "2025-07-10",
      time: "12:00",
      location: "Austin, TX",
      address: "900 Barton Springs Rd, Austin, TX 78704",
      category: "Music",
      status: "upcoming",
      total_capacity: 5000,
      image_url: "/placeholder.svg?height=400&width=600",
      organizer_id: "user-1", // This should be a real user ID
    },
    {
      title: "Blockchain Summit",
      description: "Learn about the latest developments in blockchain technology and cryptocurrency.",
      date: "2025-08-05",
      time: "10:00",
      location: "New York, NY",
      address: "655 W 34th St, New York, NY 10001",
      category: "Conference",
      status: "upcoming",
      total_capacity: 800,
      image_url: "/placeholder.svg?height=400&width=600",
      organizer_id: "user-1", // This should be a real user ID
    },
    {
      title: "Art Exhibition",
      description: "A showcase of contemporary art from emerging artists.",
      date: "2025-09-20",
      time: "11:00",
      location: "Chicago, IL",
      address: "111 S Michigan Ave, Chicago, IL 60603",
      category: "Arts",
      status: "upcoming",
      total_capacity: 300,
      image_url: "/placeholder.svg?height=400&width=600",
      organizer_id: "user-1", // This should be a real user ID
    },
  ]

  // Insert events
  const { error: eventsError } = await supabase.from("events").insert(events)

  if (eventsError) {
    console.error("Error seeding events:", eventsError)
    return { error: eventsError.message }
  }

  // Revalidate paths
  revalidatePath("/")
  revalidatePath("/discover")
  revalidatePath("/dashboard")

  return { success: true }
}
