"use client"

import { useAuth } from "@/lib/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Users, Ticket, Calendar, BarChart3, PieChart, Activity, Download } from 'lucide-react'
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <AnalyticsSkeleton />
  }

  if (!user) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to view analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/auth/login?redirect=/analytics">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mock analytics data
  const analyticsData = {
    totalRevenue: 245680,
    totalTicketsSold: 1847,
    totalEvents: 12,
    conversionRate: 42.3,
    revenueGrowth: 15.2,
    ticketGrowth: 8.7,
    eventGrowth: 25.0,
    conversionGrowth: -2.1,
    topEvents: [
      { name: "Tech Conference 2025", revenue: 89500, tickets: 450, growth: 12.5 },
      { name: "Blockchain Summit", revenue: 76800, tickets: 320, growth: 8.2 },
      { name: "AI Workshop Series", revenue: 45200, tickets: 280, growth: -3.1 },
      { name: "Startup Pitch Night", revenue: 34180, tickets: 297, growth: 18.7 },
    ],
    categoryBreakdown: [
      { category: "Technology", percentage: 45, revenue: 110556 },
      { category: "Business", percentage: 25, revenue: 61420 },
      { category: "Arts & Culture", percentage: 20, revenue: 49136 },
      { category: "Sports", percentage: 10, revenue: 24568 },
    ],
    monthlyData: [
      { month: "Jan", revenue: 18500, tickets: 125 },
      { month: "Feb", revenue: 22300, tickets: 148 },
      { month: "Mar", revenue: 28900, tickets: 189 },
      { month: "Apr", revenue: 35600, tickets: 234 },
      { month: "May", revenue: 41200, tickets: 287 },
      { month: "Jun", revenue: 48300, tickets: 325 },
    ]
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your event performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button asChild>
            <Link href="/create">Create Event</Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +{analyticsData.revenueGrowth}% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalTicketsSold.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +{analyticsData.ticketGrowth}% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalEvents}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +{analyticsData.eventGrowth}% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              {analyticsData.conversionGrowth}% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Revenue chart visualization</p>
                    <p className="text-xs text-muted-foreground mt-1">Interactive chart coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
                <CardDescription>Revenue distribution by event category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.categoryBreakdown.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                        }`} />
                        <span className="text-sm font-medium">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">${category.revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{category.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Events</CardTitle>
              <CardDescription>Your highest revenue generating events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.tickets} tickets sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${event.revenue.toLocaleString()}</div>
                      <div className="flex items-center text-xs">
                        {event.growth > 0 ? (
                          <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                        )}
                        <span className={event.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                          {event.growth > 0 ? '+' : ''}{event.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
              <CardDescription>Detailed breakdown of all your events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Event Name</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-right py-3 px-4">Tickets Sold</th>
                      <th className="text-right py-3 px-4">Revenue</th>
                      <th className="text-right py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.topEvents.map((event, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 font-medium">{event.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">Jun 15, 2025</td>
                        <td className="text-right py-3 px-4">{event.tickets}</td>
                        <td className="text-right py-3 px-4 font-medium">${event.revenue.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          <Badge variant="outline">Active</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue breakdown by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.monthlyData.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <span className="font-medium">${month.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Where your revenue comes from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ticket Sales</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Merchandise</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sponsorships</span>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>Who's attending your events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Age 18-25</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Age 26-35</span>
                      <span>40%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Age 36-45</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Age 45+</span>
                      <span>10%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Where your attendees are from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">California</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New York</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Texas</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Florida</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Other</span>
                    <span className="font-medium">18%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
