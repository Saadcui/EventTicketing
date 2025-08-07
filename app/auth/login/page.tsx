import LoginForm from "@/frontend/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Decentralized Event Platform",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
