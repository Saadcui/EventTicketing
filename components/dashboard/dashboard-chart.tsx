"use client"

import {
  Chart,
  ChartLegend,
  ChartLegendContent,
  ChartPie,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartData {
  name: string
  value: number
  color: string
}

interface DashboardChartProps {
  data: ChartData[]
}

export default function DashboardChart({ data }: DashboardChartProps) {
  return (
    <div className="h-[300px]">
      <Chart>
        <ChartPie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </ChartPie>
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
        <ChartLegend layout="horizontal" verticalAlign="bottom" align="center">
          <ChartLegendContent />
        </ChartLegend>
      </Chart>
    </div>
  )
}

// This is a custom component to work with the Chart component
function Cell({ fill, ...props }: { fill: string; [key: string]: any }) {
  return <path {...props} fill={fill} />
}
