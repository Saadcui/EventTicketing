"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/supabase/database.types"

type Event = Database["public"]["Tables"]["events"]["Row"]
type TicketType = Database["public"]["Tables"]["ticket_types"]["Row"]

export async function getEvents(category?: string, limit = 100) {
  const supabase = createActionClient()

  let query = supabase.from("events").select("*").order("created_at", { ascending: false }).limit(limit)

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data
}

export async function getEvent(id: string) {
  const supabase = createActionClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      profiles(id, full_name, avatar_url),
      ticket_types(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data
}

export async function getUserEvents(userId: string) {
  const supabase = createActionClient()

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user events:", error)
    return []
  }

  return data
}

export async function createEvent(formData: FormData) {
  const supabase = createActionClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create an event" }
  }

  // Extract event data from form
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const location = formData.get("location") as string
  const address = formData.get("address") as string
  const category = formData.get("category") as string
  const status = (formData.get("status") as string) || "draft"
  const totalCapacity = Number.parseInt(formData.get("totalCapacity") as string) || 0

  // Create the event
  const { data: event, error } = await supabase
    .from("events")
    .insert({
      title,
      description,
      date,
      time,
      location,
      address,
      category,
      status,
      total_capacity: totalCapacity,
      organizer_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  redirect(`/events/${event.id}/edit`)
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = createActionClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to update an event" }
  }

  // Extract event data from form
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const location = formData.get("location") as string
  const address = formData.get("address") as string
  const category = formData.get("category") as string
  const status = formData.get("status") as string
  const totalCapacity = Number.parseInt(formData.get("totalCapacity") as string) || 0

  // Update the event
  const { error } = await supabase
    .from("events")
    .update({
      title,
      description,
      date,
      time,
      location,
      address,
      category,
      status,
      total_capacity: totalCapacity,
    })
    .eq("id", id)
    .eq("organizer_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/events/${id}`)
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteEvent(id: string) {
  const supabase = createActionClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to delete an event" }
  }

  // Delete the event
  const { error } = await supabase.from("events").delete().eq("id", id).eq("organizer_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}
