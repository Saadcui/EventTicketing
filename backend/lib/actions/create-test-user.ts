"use server"

import { createServerSupabaseClient } from "../supabase/server"

export async function createTestUser() {
  const supabase = createServerSupabaseClient()

  // Create a test user
  const email = `test${Math.floor(Math.random() * 10000)}@example.com`
  const password = "password123"

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: `testuser${Math.floor(Math.random() * 10000)}`,
        full_name: "Test User",
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Failed to create user" }
  }

  // Create the profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    full_name: "Test User",
    avatar_url: "",
    role: "user",
  })

  if (profileError) {
    return { error: profileError.message }
  }

  return {
    success: true,
    email,
    password,
  }
}
