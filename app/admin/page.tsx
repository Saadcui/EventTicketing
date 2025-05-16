import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { seedDatabase } from "@/lib/actions/seed"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const supabase = createServerClient()

  // Get the user session
  const { data } = await supabase.auth.getSession()

  // If there's no session, redirect to login
  if (!data.session) {
    redirect("/auth/login?redirect=/admin")
  }

  // Get user profile to check if they're an admin or organizer
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.session.user.id).single()

  // If user is not an admin or organizer, redirect to dashboard
  if (!profile || (profile.role !== "admin" && profile.role !== "organizer")) {
    redirect("/dashboard")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seed Database</CardTitle>
            <CardDescription>Populate the database with sample events, ticket types, and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={seedDatabase}>
              <Button type="submit">Seed Database</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Role</CardTitle>
            <CardDescription>Update your role to organizer for testing purposes</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async () => {
                "use server"
                const supabase = createServerClient()
                const {
                  data: { user },
                } = await supabase.auth.getUser()

                if (!user) return

                await supabase.from("profiles").update({ role: "organizer" }).eq("id", user.id)

                redirect("/dashboard")
              }}
            >
              <Button type="submit">Become an Organizer</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
