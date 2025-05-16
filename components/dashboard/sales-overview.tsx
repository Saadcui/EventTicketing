"use client"

import {
  Chart,
  ChartLine,
  ChartArea,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartTooltipContent,
  ChartGrid,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

interface SalesData {
  name: string
  tickets: number
  revenue: number
}

interface SalesOverviewProps {
  data: SalesData[]
}

export default function SalesOverview({ data }: SalesOverviewProps) {
  return (
    <div className="h-[300px]">
      <Chart data={data}>
        <ChartGrid strokeDasharray="3 3" />
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
        <ChartArea type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
        <ChartLine type="monotone" dataKey="tickets" stroke="#82ca9d" />
        <ChartLegend>
          <ChartLegendContent />
        </ChartLegend>
      </Chart>
    </div>
  )
}
