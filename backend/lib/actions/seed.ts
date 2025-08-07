"use server"

import { createServerSupabaseClient } from "../supabase/server"
import { revalidatePath } from "next/cache"

export async function seedDatabase() {
  const supabase = createServerSupabaseClient()

  // Create test users
  const testUsers = [
    {
      email: "organizer@example.com",
      password: "password123",
      username: "organizer",
      full_name: "Event Organizer",
      role: "organizer",
    },
    {
      email: "admin@example.com",
      password: "password123",
      username: "admin",
      full_name: "Admin User",
      role: "admin",
    },
    {
      email: "user@example.com",
      password: "password123",
      username: "user",
      full_name: "Regular User",
      role: "user",
    },
  ]

  const createdUsers = []

  for (const user of testUsers) {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", user.username)
      .single()

    if (existingUser) {
      console.log(`User ${user.username} already exists, skipping...`)
      continue
    }

    // Create the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          username: user.username,
          full_name: user.full_name,
        },
      },
    })

    if (authError) {
      console.error(`Error creating user ${user.username}:`, authError)
      continue
    }

    if (!authData.user) {
      console.error(`Failed to create user ${user.username}`)
      continue
    }

    // Create the profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      username: user.username,
      full_name: user.full_name,
      avatar_url: "",
      role: user.role,
    })

    if (profileError) {
      console.error(`Error creating profile for ${user.username}:`, profileError)
      continue
    }

    createdUsers.push(authData.user.id)
  }

  // Create test events
  if (createdUsers.length > 0) {
    const organizerId = createdUsers[0] // Use the first created user as organizer

    const testEvents = [
      {
        title: "Tech Conference 2023",
        description:
          "Join us for the biggest tech conference of the year. Learn about the latest technologies and network with industry professionals.",
        location: "San Francisco, CA",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        category: "Technology",
        price: 99.99,
        capacity: 500,
        image_url: "/placeholder.svg?height=400&width=800",
        organizer_id: organizerId,
        is_published: true,
      },
      {
        title: "Music Festival",
        description: "A weekend of amazing music performances from top artists around the world.",
        location: "Austin, TX",
        date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
        category: "Music",
        price: 149.99,
        capacity: 1000,
        image_url: "/placeholder.svg?height=400&width=800",
        organizer_id: organizerId,
        is_published: true,
      },
      {
        title: "Blockchain Summit",
        description: "Explore the future of blockchain technology and cryptocurrency.",
        location: "Miami, FL",
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
        category: "Technology",
        price: 199.99,
        capacity: 300,
        image_url: "/placeholder.svg?height=400&width=800",
        organizer_id: organizerId,
        is_published: true,
      },
    ]

    for (const event of testEvents) {
      const { error } = await supabase.from("events").insert(event)

      if (error) {
        console.error(`Error creating event ${event.title}:`, error)
      }
    }
  }

  revalidatePath("/")

  return { success: true }
}
