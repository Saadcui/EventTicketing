"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-muted/50">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Discover and attend events with <span className="text-primary">blockchain security</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Find and purchase tickets for the best events near you, secured by blockchain technology to prevent fraud
            and ensure authenticity.
          </p>

          <div className="w-full max-w-md mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events, artists, or venues..."
                className="pl-10 h-12 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/discover">Explore Events</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/create">Host an Event</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
