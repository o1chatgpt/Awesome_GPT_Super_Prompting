"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/charts"

interface UserStatisticsProps {
  userId: string
}

export function UserStatistics({ userId }: UserStatisticsProps) {
  // This would typically fetch data from an API
  const mockData = {
    daily: [
      { name: "Mon", tasks: 4 },
      { name: "Tue", tasks: 7 },
      { name: "Wed", tasks: 5 },
      { name: "Thu", tasks: 6 },
      { name: "Fri", tasks: 8 },
      { name: "Sat", tasks: 3 },
      { name: "Sun", tasks: 2 },
    ],
    weekly: [
      { name: "Week 1", tasks: 23 },
      { name: "Week 2", tasks: 18 },
      { name: "Week 3", tasks: 25 },
      { name: "Week 4", tasks: 31 },
    ],
    monthly: [
      { name: "Jan", tasks: 65 },
      { name: "Feb", tasks: 78 },
      { name: "Mar", tasks: 56 },
      { name: "Apr", tasks: 89 },
      { name: "May", tasks: 94 },
      { name: "Jun", tasks: 76 },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>Task creation and completion statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="pt-4">
            <BarChart
              data={mockData.daily}
              index="name"
              categories={["tasks"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value} tasks`}
              yAxisWidth={30}
            />
          </TabsContent>
          <TabsContent value="weekly" className="pt-4">
            <BarChart
              data={mockData.weekly}
              index="name"
              categories={["tasks"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value} tasks`}
              yAxisWidth={40}
            />
          </TabsContent>
          <TabsContent value="monthly" className="pt-4">
            <LineChart
              data={mockData.monthly}
              index="name"
              categories={["tasks"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value} tasks`}
              yAxisWidth={40}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
