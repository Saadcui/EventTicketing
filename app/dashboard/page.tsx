'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Users, DollarSign, TrendingUp, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { mockAuth } from '@/lib/mock-auth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface Event {
  id: string
  title: string
  date: string
  location: string
  ticketsSold: number
  totalTickets: number
  revenue: number
  status: 'upcoming' | 'ongoing' | 'completed'
  category: string
}

interface DashboardMetrics {
  totalEvents: number
  totalTicketsSold: number
  totalRevenue: number
  activeEvents: number
}

export default function DashboardPage() {
  const [user, setUser] = useState(mockAuth.getCurrentUser())
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    activeEvents: 0
  })
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = mockAuth.subscribe((state) => {
      setUser(state.user)
      if (!state.user && !state.isLoading) {
        router.push('/auth/login')
      }
    })

    return unsubscribe
  }, [router])

  useEffect(() => {
    if (user) {
      // Simulate loading dashboard data
      setTimeout(() => {
        setMetrics({
          totalEvents: 12,
          totalTicketsSold: 2847,
          totalRevenue: 142350,
          activeEvents: 5
        })

        setEvents([
          {
            id: '1',
            title: 'Tech Conference 2024',
            date: '2024-03-15',
            location: 'San Francisco, CA',
            ticketsSold: 450,
            totalTickets: 500,
            revenue: 22500,
            status: 'upcoming',
            category: 'Technology'
          },
          {
            id: '2',
            title: 'Music Festival Summer',
            date: '2024-04-20',
            location: 'Austin, TX',
            ticketsSold: 1200,
            totalTickets: 1500,
            revenue: 60000,
            status: 'upcoming',
            category: 'Music'
          },
          {
            id: '3',
            title: 'Art Exhibition Opening',
            date: '2024-02-28',
            location: 'New York, NY',
            ticketsSold: 180,
            totalTickets: 200,
            revenue: 9000,
            status: 'completed',
            category: 'Art'
          },
          {
            id: '4',
            title: 'Business Summit',
            date: '2024-05-10',
            location: 'Chicago, IL',
            ticketsSold: 320,
            totalTickets: 400,
            revenue: 16000,
            status: 'upcoming',
            category: 'Business'
          },
          {
            id: '5',
            title: 'Food & Wine Expo',
            date: '2024-03-25',
            location: 'Los Angeles, CA',
            ticketsSold: 697,
            totalTickets: 800,
            revenue: 34850,
            status: 'ongoing',
            category: 'Food'
          }
        ])

        setLoading(false)
      }, 1000)
    }
  }, [user])

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId))
    toast({
      title: "Event deleted",
      description: "The event has been successfully deleted.",
    })
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h2>
          <Button onClick={() => router.push('/auth/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <Button onClick={() => router.push('/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalTicketsSold.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +25% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeEvents}</div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Events Management */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Events</CardTitle>
                <CardDescription>
                  Manage and monitor all your events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{event.title}</h3>
                          <Badge variant={
                            event.status === 'upcoming' ? 'default' :
                            event.status === 'ongoing' ? 'secondary' : 'outline'
                          }>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.date} • {event.location}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span>{event.ticketsSold}/{event.totalTickets} tickets sold</span>
                          <span>${event.revenue.toLocaleString()} revenue</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/events/${event.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/events/${event.id}/edit`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Events scheduled for the future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.filter(e => e.status === 'upcoming').map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.date} • {event.location}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span>{event.ticketsSold}/{event.totalTickets} tickets sold</span>
                          <span>${event.revenue.toLocaleString()} revenue</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/events/${event.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/events/${event.id}/edit`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ongoing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ongoing Events</CardTitle>
                <CardDescription>
                  Events currently happening
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.filter(e => e.status === 'ongoing').map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.date} • {event.location}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span>{event.ticketsSold}/{event.totalTickets} tickets sold</span>
                          <span>${event.revenue.toLocaleString()} revenue</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/events/${event.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Events</CardTitle>
                <CardDescription>
                  Past events and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.filter(e => e.status === 'completed').map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.date} • {event.location}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span>{event.ticketsSold}/{event.totalTickets} tickets sold</span>
                          <span>${event.revenue.toLocaleString()} revenue</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/events/${event.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
