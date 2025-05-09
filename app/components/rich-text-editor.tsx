"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, List, ListOrdered, LinkIcon, Heading1, Heading2 } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

// A simplified rich text editor that doesn't rely on TipTap
export function RichTextEditor({ content, onChange, placeholder = "Write something..." }: RichTextEditorProps) {
  const [showHelp, setShowHelp] = useState(false)

  // Simple HTML tag insertion
  const insertTag = (tag: string, endTag?: string) => {
    const textarea = document.getElementById("rich-text-area") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const beforeText = content.substring(0, start)
    const afterText = content.substring(end)

    const finalEndTag = endTag || tag
    const newContent = `${beforeText}<${tag}>${selectedText}</${finalEndTag}>${afterText}`
    onChange(newContent)

    // Reset cursor position after state update
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2)
    }, 0)
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/20">
        <Toggle size="sm" onClick={() => insertTag("strong")}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onClick={() => insertTag("em")}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onClick={() => insertTag("h1")}>
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onClick={() => insertTag("h2")}>
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onClick={() => insertTag("ul", "ul")}>
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onClick={() => insertTag("ol", "ol")}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onClick={() => insertTag('a href=""')}>
          <LinkIcon className="h-4 w-4" />
        </Toggle>
        <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setShowHelp(!showHelp)}>
          Help
        </Button>
      </div>
      <Textarea
        id="rich-text-area"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] rounded-none border-0 focus-visible:ring-0 resize-none"
      />
      <div className="p-2 border-t bg-muted/20 text-xs text-muted-foreground">
        <p>Available variables: {"{{role}}, {{invitation_link}}, {{inviter_name}}, {{email}}"}</p>
        {showHelp && (
          <div className="mt-2 p-2 bg-muted rounded-sm">
            <p className="font-medium mb-1">HTML Tags:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <code>&lt;p&gt;Paragraph&lt;/p&gt;</code>
              </li>
              <li>
                <code>&lt;strong&gt;Bold&lt;/strong&gt;</code>
              </li>
              <li>
                <code>&lt;em&gt;Italic&lt;/em&gt;</code>
              </li>
              <li>
                <code>&lt;a href="..."&gt;Link&lt;/a&gt;</code>
              </li>
              <li>
                <code>&lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;</code>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
