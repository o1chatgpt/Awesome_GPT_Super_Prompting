"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface TemplatePreviewProps {
  content: string
  variables: Record<string, string>
}

export function TemplatePreview({ content, variables }: TemplatePreviewProps) {
  const [processedContent, setProcessedContent] = useState("")

  useEffect(() => {
    // Process the template with the provided variables
    const processed = Object.entries(variables).reduce((result, [key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
      return result.replace(regex, value)
    }, content)

    setProcessedContent(processed)
  }, [content, variables])

  return (
    <div className="space-y-4">
      <Card className="border border-dashed">
        <CardContent className="p-0">
          <div className="bg-muted p-2 text-xs border-b">Email Preview</div>
          <div className="p-4">
            <iframe
              title="Template Preview"
              srcDoc={processedContent}
              className="w-full min-h-[500px] border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>
          This is a preview of how your email template will appear to recipients. The preview uses sample data for the
          variables.
        </p>
      </div>
    </div>
  )
}
