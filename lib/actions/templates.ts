"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/database"
import { checkUserRole, getCurrentUser } from "./auth"
import type { InvitationTemplate } from "@/lib/database"

// Get all invitation templates
export async function getInvitationTemplates() {
  try {
    // Check if the current user is an admin
    const isAdmin = await checkUserRole("admin")
    if (!isAdmin) {
      return { error: "Unauthorized access", templates: [] }
    }

    const { data, error } = await supabase.from("invitation_templates").select("*").order("name")

    if (error) {
      console.error("Error fetching templates:", error)
      return { error: error.message, templates: [] }
    }

    return { templates: data as InvitationTemplate[] }
  } catch (err) {
    console.error("Unexpected error in getInvitationTemplates:", err)
    return { error: "An unexpected error occurred", templates: [] }
  }
}

// Get a single template by ID
export async function getInvitationTemplate(id: string) {
  try {
    // Check if the current user is an admin
    const isAdmin = await checkUserRole("admin")
    if (!isAdmin) {
      return { error: "Unauthorized access" }
    }

    const { data, error } = await supabase.from("invitation_templates").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching template:", error)
      return { error: error.message }
    }

    return { template: data as InvitationTemplate }
  } catch (err) {
    console.error("Unexpected error in getInvitationTemplate:", err)
    return { error: "An unexpected error occurred" }
  }
}

// Get the default template
export async function getDefaultTemplate() {
  try {
    const { data, error } = await supabase.from("invitation_templates").select("*").eq("is_default", true).single()

    if (error) {
      // If no default template exists, create one
      if (error.code === "PGRST116") {
        const defaultTemplate = {
          name: "Default Template",
          subject: "Invitation to join Web Scraper Interface",
          content: `<p>Hello,</p>
<p>You have been invited to join the Web Scraper Interface as a {{role}}.</p>
<p>Please click the link below to complete your registration:</p>
<p>{{invitation_link}}</p>
<p>This invitation will expire in 7 days.</p>
<p>Best regards,<br>{{inviter_name}}</p>`,
          is_default: true,
        }

        const { data: newTemplate, error: createError } = await supabase
          .from("invitation_templates")
          .insert(defaultTemplate)
          .select()
          .single()

        if (createError) {
          console.error("Error creating default template:", createError)
          return { error: createError.message }
        }

        return { template: newTemplate as InvitationTemplate }
      }
      console.error("Error fetching default template:", error)
      return { error: error.message }
    }

    return { template: data as InvitationTemplate }
  } catch (err) {
    console.error("Unexpected error in getDefaultTemplate:", err)
    return { error: "An unexpected error occurred" }
  }
}

// Create a new template
export async function createInvitationTemplate(template: {
  name: string
  subject: string
  content: string
  is_default?: boolean
}) {
  try {
    // Check if the current user is an admin
    const isAdmin = await checkUserRole("admin")
    if (!isAdmin) {
      return { error: "Unauthorized access" }
    }

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { error: "User not found" }
    }

    // If this is set as default, unset any existing default
    if (template.is_default) {
      await supabase.from("invitation_templates").update({ is_default: false }).eq("is_default", true)
    }

    const { data, error } = await supabase
      .from("invitation_templates")
      .insert({
        ...template,
        created_by: currentUser.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating template:", error)
      return { error: error.message }
    }

    revalidatePath("/admin/templates")
    return { template: data as InvitationTemplate, success: true }
  } catch (err) {
    console.error("Unexpected error in createInvitationTemplate:", err)
    return { error: "An unexpected error occurred" }
  }
}

// Update an existing template
export async function updateInvitationTemplate(
  id: string,
  template: {
    name?: string
    subject?: string
    content?: string
    is_default?: boolean
  },
) {
  try {
    // Check if the current user is an admin
    const isAdmin = await checkUserRole("admin")
    if (!isAdmin) {
      return { error: "Unauthorized access" }
    }

    // If this is set as default, unset any existing default
    if (template.is_default) {
      await supabase.from("invitation_templates").update({ is_default: false }).eq("is_default", true).neq("id", id)
    }

    const { data, error } = await supabase
      .from("invitation_templates")
      .update({
        ...template,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating template:", error)
      return { error: error.message }
    }

    revalidatePath("/admin/templates")
    return { template: data as InvitationTemplate, success: true }
  } catch (err) {
    console.error("Unexpected error in updateInvitationTemplate:", err)
    return { error: "An unexpected error occurred" }
  }
}

// Delete a template
export async function deleteInvitationTemplate(id: string) {
  try {
    // Check if the current user is an admin
    const isAdmin = await checkUserRole("admin")
    if (!isAdmin) {
      return { error: "Unauthorized access" }
    }

    // Check if this is the default template
    const { data: template } = await supabase.from("invitation_templates").select("is_default").eq("id", id).single()

    if (template?.is_default) {
      return { error: "Cannot delete the default template" }
    }

    // Check if any invitations are using this template
    const { data: invitations } = await supabase.from("invitations").select("id").eq("template_id", id).limit(1)

    if (invitations && invitations.length > 0) {
      return { error: "This template is in use by existing invitations" }
    }

    const { error } = await supabase.from("invitation_templates").delete().eq("id", id)

    if (error) {
      console.error("Error deleting template:", error)
      return { error: error.message }
    }

    revalidatePath("/admin/templates")
    return { success: true }
  } catch (err) {
    console.error("Unexpected error in deleteInvitationTemplate:", err)
    return { error: "An unexpected error occurred" }
  }
}

// Process template with variables
export async function processTemplate(template: string, variables: Record<string, string>): Promise<string> {
  try {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
      const trimmedVar = variable.trim()
      return variables[trimmedVar] || match
    })
  } catch (err) {
    console.error("Error processing template:", err)
    return template
  }
}

// For compatibility with existing code
export const getTemplate = getInvitationTemplate
export const createTemplate = createInvitationTemplate
export const updateTemplate = updateInvitationTemplate
export const deleteTemplate = deleteInvitationTemplate
export const getTemplates = getInvitationTemplates
