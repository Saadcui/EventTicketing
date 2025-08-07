import { createServerSupabaseClient } from "./supabase/server"

export async function getSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getUserDetails() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    return {
      ...user,
      ...profile,
    }
  } catch (error) {
    console.error("Error getting user details:", error)
    return null
  }
}

export async function isUserAuthenticated() {
  const session = await getSession()
  return !!session
}

export async function isUserAdmin() {
  const user = await getUserDetails()
  return user?.role === "admin"
}

export async function isUserOrganizer() {
  const user = await getUserDetails()
  return user?.role === "organizer" || user?.role === "admin"
}
