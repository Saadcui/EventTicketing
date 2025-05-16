"use server"

import { createActionClient } from "@/lib/supabase/server"

export async function seedDatabase() {
  const supabase = createActionClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to seed the database" }
  }

  // Create sample events
  const events = [
    {
      title: "Tech Conference 2025",
      description:
        "Join us for the biggest tech conference of the year, featuring keynotes from industry leaders, workshops, networking opportunities, and more.",
      date: "June 15, 2025",
      time: "9:00 AM - 6:00 PM",
      location: "San Francisco Convention Center",
      address: "747 Howard St, San Francisco, CA 94103",
      category: "Conference",
      status: "on_sale",
      total_capacity: 1000,
      organizer_id: user.id,
    },
    {
      title: "Summer Music Festival",
      description: "Three days of amazing music across multiple stages featuring top artists and emerging talent.",
      date: "July 10-12, 2025",
      time: "12:00 PM - 11:00 PM",
      location: "Golden Gate Park",
      address: "501 Stanyan St, San Francisco, CA 94117",
      category: "Music",
      status: "draft",
      total_capacity: 5000,
      organizer_id: user.id,
    },
    {
      title: "Blockchain Summit",
      description: "Explore the future of blockchain technology with industry experts and thought leaders.",
      date: "August 5, 2025",
      time: "10:00 AM - 5:00 PM",
      location: "New York Hilton Midtown",
      address: "1335 6th Ave, New York, NY 10019",
      category: "Conference",
      status: "on_sale",
      total_capacity: 800,
      organizer_id: user.id,
    },
    {
      title: "Art Exhibition",
      description: "A showcase of contemporary art from emerging artists around the world.",
      date: "September 20, 2025",
      time: "11:00 AM - 7:00 PM",
      location: "Modern Art Gallery",
      address: "151 3rd St, San Francisco, CA 94103",
      category: "Arts",
      status: "upcoming",
      total_capacity: 300,
      organizer_id: user.id,
    },
  ]

  // Insert events
  for (const event of events) {
    const { data: eventData, error: eventError } = await supabase.from("events").insert(event).select().single()

    if (eventError) {
      console.error("Error creating event:", eventError)
      continue
    }

    // Create ticket types for each event
    if (eventData.id) {
      const ticketTypes = [
        {
          event_id: eventData.id,
          name: "Early Bird",
          description: "Limited availability. Access to all sessions and workshops.",
          price: 99,
          quantity: 200,
          max_per_order: 2,
        },
        {
          event_id: eventData.id,
          name: "Standard",
          description: "Access to all sessions and workshops.",
          price: 149,
          quantity: 600,
          max_per_order: 5,
        },
        {
          event_id: eventData.id,
          name: "VIP",
          description: "Premium seating, exclusive networking event, and conference swag.",
          price: 299,
          quantity: 200,
          max_per_order: 2,
        },
      ]

      for (const ticketType of ticketTypes) {
        const { error: ticketTypeError } = await supabase.from("ticket_types").insert(ticketType)

        if (ticketTypeError) {
          console.error("Error creating ticket type:", ticketTypeError)
        }
      }
    }
  }

  return { success: true, message: "Database seeded successfully" }
}
