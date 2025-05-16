import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import RegisterForm from "@/components/auth/register-form"

export default async function RegisterPage() {
  // Check if user is already logged in
  const supabase = createServerClient()
  const { data } = await supabase.auth.getSession()

  // If user is logged in, redirect to dashboard
  if (data.session) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <RegisterForm />
    </div>
  )
}
