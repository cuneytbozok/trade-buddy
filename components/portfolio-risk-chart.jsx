// @/components/portfolio-risk-chart.jsx
"use client";

import React from "react";
import {
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const fallbackData = [
  { risk: "High Risk", percentage: 15 },
  { risk: "Low Risk", percentage: 35 },
  { risk: "Medium Risk", percentage: 25 },
  { risk: "Medium-High Risk", percentage: 20 },
  { risk: "Very High Risk", percentage: 5 },
];

export const PortfolioRiskChart = ({ data = fallbackData }) => {
  return (
    <Card className="h-full">
      <CardHeader className="items-center pb-4">
        <CardTitle>Portfolio Risk Chart</CardTitle>
        <CardDescription>
          Visualizing the risk ratio of your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {/* Responsive Radar Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={data} outerRadius="70%">
            <PolarGrid />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Risk"
              dataKey="percentage"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Risk Data Table */}
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk Category</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.risk}</TableCell>
                  <TableCell>{item.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};