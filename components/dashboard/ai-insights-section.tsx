import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AiInsightsSection() {
  // In a real app, you would fetch AI-generated insights based on event data
  const insights = [
    {
      title: "Pricing Strategy",
      description: "Consider increasing VIP ticket prices by 10-15% for your next event based on high demand patterns.",
    },
    {
      title: "Marketing Opportunity",
      description:
        "Your events perform 30% better when promoted 3 weeks in advance. Consider starting promotion for your upcoming event now.",
    },
    {
      title: "Attendee Demographics",
      description:
        "Your events attract primarily 25-34 year old professionals. Consider partnerships with companies targeting this demographic.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>Recommendations based on your event data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p>{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
