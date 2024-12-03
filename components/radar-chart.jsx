"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, PolarRadiusAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { risk: "High Risk", percentage: 15 },
  { risk: "Low Risk", percentage: 35 },
  { risk: "Medium Risk", percentage: 25 },
  { risk: "Medium-High Risk", percentage: 20 },
  { risk: "Very High Risk", percentage: 5 }
]

const chartConfig = {
  percentage: {
    label: "Risk Percentage",
    color: "hsl(var(--chart-1))",
  }
}

export default function Component() {
  return (
    (<Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Portfolio Risk Chart</CardTitle>
        <CardDescription>
          Showing the risk ratio of your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
          <RadarChart data={chartData} outerRadius="80%">
            <ChartTooltip content={<ChartTooltipContent />} />
            <PolarGrid gridType="circle" />
            <PolarAngleAxis
              dataKey="risk"
              tick={(props) => {
                const { x, y, payload } = props;
                return (
                  (<g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize="12px">
                      {payload.value}
                    </text>
                  </g>)
                );
              }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Risk"
              dataKey="percentage"
              stroke="var(--color-percentage)"
              fill="var(--color-percentage)"
              fillOpacity={0.6} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>)
  );
}

