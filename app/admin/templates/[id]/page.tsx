import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getInvitationTemplate } from "@/lib/actions/templates"
import { EditTemplateForm } from "@/components/edit-template-form"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic"

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const { template, error } = await getInvitationTemplate(params.id)

  if (error || !template) {
    notFound()
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
        <p className="text-muted-foreground">Modify the invitation template</p>
      </div>
      <Separator />
      <Suspense fallback={<div>Loading template...</div>}>
        <EditTemplateForm template={template} />
      </Suspense>
    </div>
  )
}
