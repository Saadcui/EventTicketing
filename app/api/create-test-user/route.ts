import { createTestUser } from "@/lib/actions/create-test-user"
import { NextResponse } from "next/server"

export async function GET() {
  const result = await createTestUser()

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json(result)
}
