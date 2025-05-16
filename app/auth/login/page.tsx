import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LoginForm from "@/components/auth/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  // Check if user is already logged in
  const supabase = createServerClient()
  const { data } = await supabase.auth.getSession()

  // If user is logged in, redirect to dashboard or the requested page
  if (data.session) {
    redirect(searchParams.redirect || "/dashboard")
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <LoginForm />
    </div>
  )
}
