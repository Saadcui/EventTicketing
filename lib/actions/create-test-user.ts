"use server"

import { createActionClient } from "@/lib/supabase/server"

export async function createTestUser() {
  const supabase = createActionClient()

  // Check if test user already exists
  const { data: existingUser } = await supabase.auth.admin.getUserByEmail("test@example.com")

  if (existingUser) {
    console.log("Test user already exists")
    return { success: true, message: "Test user already exists" }
  }

  try {
    // Create test user
    const { data, error } = await supabase.auth.admin.createUser({
      email: "test@example.com",
      password: "password123",
      email_confirm: true,
      user_metadata: {
        full_name: "Test User",
        role: "organizer",
      },
    })

    if (error) {
      console.error("Error creating test user:", error.message)
      return { error: error.message }
    }

    // Create profile for test user
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: "Test User",
        role: "organizer",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Error creating test user profile:", profileError.message)
      }
    }

    return { success: true, message: "Test user created successfully" }
  } catch (error) {
    console.error("Unexpected error creating test user:", error)
    return { error: "An unexpected error occurred" }
  }
}
