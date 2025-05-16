"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function RoleUpdater() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const handleUpdateRole = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      const { data: user } = await supabase.auth.getUser()

      if (!user.user) {
        setResult({ error: "You must be logged in to update your role" })
        return
      }

      const { error } = await supabase.from("profiles").update({ role: "organizer" }).eq("id", user.user.id)

      if (error) {
        throw error
      }

      setResult({ success: true, message: "Your role has been updated to organizer" })
    } catch (error) {
      console.error("Error updating role:", error)
      setResult({ error: "An error occurred while updating your role" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Become an Organizer</CardTitle>
        <CardDescription>Update your role to organizer to create and manage events.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This is for testing purposes only. In a production environment, this would require verification.
        </p>

        {result && (
          <Alert variant={result.error ? "destructive" : "default"} className="mb-4">
            {result.error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <AlertTitle>{result.error ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{result.error || result.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateRole} disabled={isLoading}>
          {isLoading ? "Updating Role..." : "Become an Organizer"}
        </Button>
      </CardFooter>
    </Card>
  )
}
