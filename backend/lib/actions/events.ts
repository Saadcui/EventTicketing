"use server"

import { createServerSupabaseClient } from "../supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getUserDetails } from "../auth"

export async function getEvents(category?: string, searchQuery?: string) {
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from("events")
    .select("*, profiles(username, avatar_url)")
    .eq("is_published", true)
    .order("date", { ascending: true })

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data
}

export async function getEvent(id: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("events")
    .select("*, profiles(username, avatar_url)")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data
}

export async function getOrganizerEvents() {
  const user = await getUserDetails()

  if (!user) {
    return []
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching organizer events:", error)
    return []
  }

  return data
}

export async function createEvent(formData: FormData) {
  const user = await getUserDetails()

  if (!user) {
    return { error: "You must be logged in to create an event" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string
  const date = formData.get("date") as string
  const category = formData.get("category") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const capacity = Number.parseInt(formData.get("capacity") as string)
  const imageUrl = (formData.get("imageUrl") as string) || "/placeholder.svg?height=400&width=800"
  const isPublished = formData.get("isPublished") === "true"

  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("events").insert({
    title,
    description,
    location,
    date,
    category,
    price,
    capacity,
    image_url: imageUrl,
    organizer_id: user.id,
    is_published: isPublished,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function updateEvent(id: string, formData: FormData) {
  const user = await getUserDetails()

  if (!user) {
    return { error: "You must be logged in to update an event" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string
  const date = formData.get("date") as string
  const category = formData.get("category") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const capacity = Number.parseInt(formData.get("capacity") as string)
  const imageUrl = formData.get("imageUrl") as string
  const isPublished = formData.get("isPublished") === "true"

  const supabase = createServerSupabaseClient()

  // Check if the user is the organizer of this event
  const { data: event } = await supabase.from("events").select("organizer_id").eq("id", id).single()

  if (!event || (event.organizer_id !== user.id && user.role !== "admin")) {
    return { error: "You do not have permission to update this event" }
  }

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description,
      location,
      date,
      category,
      price,
      capacity,
      image_url: imageUrl,
      is_published: isPublished,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/events/${id}`)
  redirect(`/events/${id}`)
}

export async function deleteEvent(id: string) {
  const user = await getUserDetails()

  if (!user) {
    return { error: "You must be logged in to delete an event" }
  }

  const supabase = createServerSupabaseClient()

  // Check if the user is the organizer of this event
  const { data: event } = await supabase.from("events").select("organizer_id").eq("id", id).single()

  if (!event || (event.organizer_id !== user.id && user.role !== "admin")) {
    return { error: "You do not have permission to delete this event" }
  }

  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
