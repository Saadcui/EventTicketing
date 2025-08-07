import RegisterForm from "@/frontend/components/auth/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register | Decentralized Event Platform",
  description: "Create a new account",
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
