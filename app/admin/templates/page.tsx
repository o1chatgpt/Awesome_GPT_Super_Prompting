import { Suspense } from "react"
import { getInvitationTemplates } from "@/lib/actions/templates"
import { CreateTemplateButton } from "@/components/create-template-button"
import { TemplatesList } from "@/components/templates-list"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic"

export default async function TemplatesPage() {
  const { templates, error } = await getInvitationTemplates()

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invitation Templates</h1>
          <p className="text-muted-foreground">Create and manage templates for invitation emails</p>
        </div>
        <CreateTemplateButton />
      </div>
      <Separator />
      <Suspense fallback={<div>Loading templates...</div>}>
        <TemplatesList templates={templates || []} error={error} />
      </Suspense>
    </div>
  )
}
