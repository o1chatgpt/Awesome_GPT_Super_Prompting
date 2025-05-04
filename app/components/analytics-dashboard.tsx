"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/charts"
import { useState } from "react"

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("week")

  // Mock data for charts
  const scrapingActivityData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [5, 8, 3, 12, 7, 10, 4],
        backgroundColor: "rgba(37, 99, 235, 0.5)",
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 1,
      },
    ],
  }

  const dataCollectedData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Data Collected (MB)",
        data: [12, 19, 8, 25, 17, 22, 10],
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 2,
        fill: true,
      },
    ],
  }

  const contentTypeData = {
    labels: ["Text", "Images", "Links", "Tables", "Other"],
    datasets: [
      {
        label: "Content Types",
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          "rgba(37, 99, 235, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(107, 114, 128, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>Visualize your web scraping activity and results</CardDescription>
          </div>
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-[400px]">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scraping Activity</CardTitle>
              <CardDescription>Number of tasks completed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart data={scrapingActivityData} className="h-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Collected</CardTitle>
              <CardDescription>Amount of data collected over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart data={dataCollectedData} className="h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Content Type Distribution</CardTitle>
              <CardDescription>Breakdown of scraped content by type</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-80 w-80">
                <PieChart data={contentTypeData} className="h-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
