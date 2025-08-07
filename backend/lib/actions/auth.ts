"use server"

import { createServerSupabaseClient } from "../supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signIn(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  redirect("/")
}

export async function signUp(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string
  const fullName = formData.get("fullName") as string

  // Create the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    // Create the profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      username,
      full_name: fullName,
      avatar_url: "",
      role: "user",
    })

    if (profileError) {
      return { error: profileError.message }
    }
  }

  revalidatePath("/")
  redirect("/")
}

export async function signOut() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/")
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
