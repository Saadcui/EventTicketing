"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Calendar } from "lucide-react"

export default function EventSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get current search params
  const currentQuery = searchParams.get("query") || ""
  const currentLocation = searchParams.get("location") || ""
  const currentDate = searchParams.get("date") || ""
  const currentCategory = searchParams.get("category") || ""

  // Local state for form inputs
  const [query, setQuery] = useState(currentQuery)
  const [location, setLocation] = useState(currentLocation)
  const [date, setDate] = useState(currentDate)
  const [category, setCategory] = useState(currentCategory)

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Build query string
    const params = new URLSearchParams()
    if (query) params.set("query", query)
    if (location) params.set("location", location)
    if (date) params.set("date", date)
    if (category) params.set("category", category)

    // Update URL with search params
    startTransition(() => {
      router.push(`/discover?${params.toString()}`)
    })
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="San Francisco">San Francisco</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                  <SelectItem value="Chicago">Chicago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={date} onValueChange={setDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Date</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="weekend">This Weekend</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isPending}>
              <Filter className="mr-2 h-4 w-4" /> Filter Results
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
