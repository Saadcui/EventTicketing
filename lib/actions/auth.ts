"use server"

import { createActionClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signIn(formData: FormData) {
  const supabase = createActionClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.session) {
    return { error: "Failed to create session" }
  }

  revalidatePath("/")
  redirect("/dashboard")
}

export async function signUp(formData: FormData) {
  const supabase = createActionClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const role = (formData.get("role") as string) || "attendee"

  // First, check if user already exists
  const { data: existingUser } = await supabase.from("profiles").select("id").eq("id", email).single()

  if (existingUser) {
    return { error: "User with this email already exists" }
  }

  // Create the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // For development purposes, auto-confirm the user
  if (process.env.NODE_ENV === "development") {
    // In development, we'll automatically sign in the user
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

    revalidatePath("/")
    redirect("/dashboard")
  }

  return {
    success: true,
    message: "Check your email for the confirmation link",
  }
}

export async function signOut() {
  const supabase = createActionClient()
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/")
}

export async function updateUserProfile(formData: FormData) {
  const supabase = createActionClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const fullName = formData.get("fullName") as string
  const avatarUrl = formData.get("avatarUrl") as string

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/profile")
  return { success: true }
}
