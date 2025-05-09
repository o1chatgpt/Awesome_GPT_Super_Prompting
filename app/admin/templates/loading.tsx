import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function TemplatesLoading() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invitation Templates</h1>
          <p className="text-muted-foreground">Create and manage templates for invitation emails</p>
        </div>
        <Skeleton className="h-10 w-[150px]" />
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
      </div>
    </div>
  )
}
