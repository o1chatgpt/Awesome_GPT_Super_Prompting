import { Suspense } from "react"
import { DashboardContent } from "../components/dashboard-content"
import DashboardSkeleton from "./loading"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">User Dashboard</h1>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
