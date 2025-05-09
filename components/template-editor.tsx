"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
} from "lucide-react"

interface TemplateEditorProps {
  content: string
  onChange: (content: string) => void
}

export function TemplateEditor({ content, onChange }: TemplateEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const insertAtCursor = (before: string, after = "") => {
    if (!editorRef.current) return

    const start = editorRef.current.selectionStart
    const end = editorRef.current.selectionEnd
    const selectedText = content.substring(start, end)
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end)

    onChange(newContent)

    // Set cursor position after the operation
    setTimeout(() => {
      if (!editorRef.current) return
      editorRef.current.focus()
      editorRef.current.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const formatHandlers = {
    bold: () => insertAtCursor("<strong>", "</strong>"),
    italic: () => insertAtCursor("<em>", "</em>"),
    link: () => {
      const url = prompt("Enter URL:", "https://")
      if (url) insertAtCursor(`<a href="${url}" style="color: #7c3aed; text-decoration: underline;">`, "</a>")
    },
    list: () => insertAtCursor("<ul>\n  <li>", "</li>\n  <li>Item</li>\n</ul>"),
    orderedList: () => insertAtCursor("<ol>\n  <li>", "</li>\n  <li>Item</li>\n</ol>"),
    alignLeft: () => insertAtCursor('<div style="text-align: left;">', "</div>"),
    alignCenter: () => insertAtCursor('<div style="text-align: center;">', "</div>"),
    alignRight: () => insertAtCursor('<div style="text-align: right;">', "</div>"),
    h1: () => insertAtCursor('<h1 style="color: #7c3aed; margin-top: 20px; margin-bottom: 10px;">', "</h1>"),
    h2: () => insertAtCursor('<h2 style="color: #7c3aed; margin-top: 15px; margin-bottom: 10px;">', "</h2>"),
    button: () => {
      const url = "{{invitation_link}}"
      insertAtCursor(
        `<div style="text-align: center; margin: 30px 0;">
  <a href="${url}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">`,
        `</a>
</div>`,
      )
    },
    divider: () => insertAtCursor('<hr style="border: 0; height: 1px; background-color: #e2e8f0; margin: 20px 0;" />'),
    box: () =>
      insertAtCursor(
        `<div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;">
  `,
        `
</div>`,
      ),
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted p-2 rounded-md flex flex-wrap gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.bold} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.italic} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.link} title="Insert Link">
          <Link className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.list} title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.orderedList} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.alignLeft} title="Align Left">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.alignCenter} title="Align Center">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.alignRight} title="Align Right">
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.h1} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.h2} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.button} title="Insert Button">
          Button
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.divider} title="Insert Divider">
          Divider
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatHandlers.box} title="Insert Box">
          Box
        </Button>
      </div>

      <Textarea
        ref={editorRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[400px] font-mono text-sm"
        placeholder="Enter your HTML template here..."
      />
    </div>
  )
}
