import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SessionsLoading() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="h-8 w-64 mb-6" />

      <Skeleton className="h-10 w-full max-w-md mb-6" />

      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div className="flex space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-[200px] mb-2" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
