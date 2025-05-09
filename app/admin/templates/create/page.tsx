import { CreateCustomTemplate } from "@/components/create-custom-template"
import { Separator } from "@/components/ui/separator"

export const metadata = {
  title: "Create Custom Template | Admin",
  description: "Create a custom invitation template for new users",
}

export default function CreateTemplatePage() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Custom Template</h1>
        <p className="text-muted-foreground">Design a personalized invitation template for new users</p>
      </div>
      <Separator />
      <CreateCustomTemplate />
    </div>
  )
}
