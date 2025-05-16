"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: string
  title: string
  date: string
  location: string
  status: string
  total_capacity: number
}

export default function EventTable({ events }: { events: Event[] }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const supabase = createClient()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      setIsDeleting(id)

      try {
        // Delete the event
        const { error } = await supabase.from("events").delete().eq("id", id)

        if (error) {
          throw error
        }

        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted.",
        })

        // Refresh the page to show updated data
        router.refresh()
      } catch (error) {
        console.error("Error deleting event:", error)
        toast({
          title: "Error",
          description: "Failed to delete event. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "on_sale":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "canceled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You haven't created any events yet.</p>
        <Button asChild>
          <Link href="/create">Create Your First Event</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                    event.status,
                  )}`}
                >
                  {formatStatus(event.status)}
                </span>
              </TableCell>
              <TableCell>{event.total_capacity}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/events/${event.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/events/${event.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDelete(event.id)}
                      disabled={isDeleting === event.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting === event.id ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
