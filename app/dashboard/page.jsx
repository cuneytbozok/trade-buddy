"use client";

import React from "react";
import { PortfolioRiskChart } from "@/components/portfolio-risk-chart";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import withAuth from "@/HOC/withAuth";



const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Monitor your portfolio performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Portfolio Risk Chart */}
        <PortfolioRiskChart />

        {/* Placeholder for Future Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Future Chart Placeholder</CardTitle>
          </CardHeader>
          <div className="p-4 text-gray-600">
            Additional charts will be added here.
          </div>
        </Card>
      </div>
    </div>
  );
}
export default withAuth(DashboardPage); // Wrap the component with withAuth