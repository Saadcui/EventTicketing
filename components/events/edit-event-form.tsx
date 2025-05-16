"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Event, updateEvent } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  date: z.string().min(1, {
    message: "Date is required.",
  }),
  status: z.enum(["Draft", "On Sale", "Upcoming", "Completed", "Canceled"]),
  totalCapacity: z.coerce.number().min(1, {
    message: "Capacity must be at least 1.",
  }),
})

interface EditEventFormProps {
  event: Event
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event.title,
      date: event.date,
      status: event.status,
      totalCapacity: event.totalCapacity,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await updateEvent({
        id: event.id,
        ...values,
      })

      toast({
        title: "Event updated",
        description: "Your event has been successfully updated.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormDescription>This is the name of your event as it will appear to attendees.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
                <Input placeholder="e.g., June 15, 2025" {...field} />
              </FormControl>
              <FormDescription>The date or date range when your event will take place.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="On Sale">On Sale</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The current status of your event.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Capacity</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormDescription>The maximum number of attendees for this event.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
