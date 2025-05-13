// Types for guest data
export interface GuestData {
  scraping_tasks?: ScrapingTask[]
  scraping_results?: ScrapingResult[]
  preferences?: UserPreferences
  recent_urls?: RecentUrl[]
  notes?: Note[]
  templates?: Template[]
  last_updated?: string
}

interface ScrapingTask {
  id: string
  url: string
  name: string
  status: "pending" | "completed" | "failed"
  created_at: string
  schedule?: string
  selectors?: string[]
}

interface ScrapingResult {
  id: string
  task_id: string
  data: any
  created_at: string
  status: "success" | "partial" | "failed"
  error?: string
}

interface UserPreferences {
  theme?: "light" | "dark" | "system"
  layout?: "default" | "compact" | "expanded"
  notifications_enabled?: boolean
  default_export_format?: "json" | "csv" | "excel"
}

interface RecentUrl {
  url: string
  title?: string
  visited_at: string
}

interface Note {
  id: string
  content: string
  created_at: string
  updated_at: string
  task_id?: string
}

interface Template {
  id: string
  name: string
  selectors: string[]
  created_at: string
}

// Storage keys
const GUEST_DATA_KEY = "web_scraper_guest_data"
const GUEST_MODE_KEY = "guestMode"

// Maximum storage size (5MB)
const MAX_STORAGE_SIZE = 5 * 1024 * 1024

/**
 * Initialize guest data storage with default values
 */
export function initGuestStorage(): void {
  if (!isGuestMode()) return

  const existingData = getGuestData()
  if (!existingData) {
    const defaultData: GuestData = {
      scraping_tasks: [],
      scraping_results: [],
      preferences: {
        theme: "system",
        layout: "default",
        notifications_enabled: true,
        default_export_format: "json",
      },
      recent_urls: [],
      notes: [],
      templates: [],
      last_updated: new Date().toISOString(),
    }

    setGuestData(defaultData)
  }
}

/**
 * Check if guest mode is enabled
 */
export function isGuestMode(): boolean {
  return localStorage.getItem(GUEST_MODE_KEY) === "true"
}

/**
 * Get all guest data
 */
export function getGuestData(): GuestData | null {
  try {
    const data = localStorage.getItem(GUEST_DATA_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error retrieving guest data:", error)
    return null
  }
}

/**
 * Set all guest data
 */
export function setGuestData(data: GuestData): boolean {
  try {
    const dataString = JSON.stringify(data)

    // Check if data exceeds storage limit
    if (dataString.length > MAX_STORAGE_SIZE) {
      console.error("Guest data exceeds maximum storage size")
      return false
    }

    localStorage.setItem(GUEST_DATA_KEY, dataString)
    return true
  } catch (error) {
    console.error("Error saving guest data:", error)
    return false
  }
}

/**
 * Update specific section of guest data
 */
export function updateGuestData<K extends keyof GuestData>(section: K, data: GuestData[K]): boolean {
  try {
    const currentData = getGuestData() || {}
    const updatedData = {
      ...currentData,
      [section]: data,
      last_updated: new Date().toISOString(),
    }

    return setGuestData(updatedData)
  } catch (error) {
    console.error(`Error updating guest ${String(section)} data:`, error)
    return false
  }
}

/**
 * Clear all guest data
 */
export function clearGuestData(): void {
  localStorage.removeItem(GUEST_DATA_KEY)
}

/**
 * Get available storage space
 */
export function getAvailableStorage(): number {
  try {
    const currentData = localStorage.getItem(GUEST_DATA_KEY) || ""
    return MAX_STORAGE_SIZE - currentData.length
  } catch (error) {
    console.error("Error calculating available storage:", error)
    return 0
  }
}

/**
 * Add a scraping task for guest user
 */
export function addGuestScrapingTask(task: Omit<ScrapingTask, "id" | "created_at">): string | null {
  try {
    const currentData = getGuestData() || {}
    const tasks = currentData.scraping_tasks || []

    // Generate a unique ID
    const id = `guest-task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newTask: ScrapingTask = {
      ...task,
      id,
      created_at: new Date().toISOString(),
    }

    const updatedTasks = [...tasks, newTask]

    if (updateGuestData("scraping_tasks", updatedTasks)) {
      return id
    }

    return null
  } catch (error) {
    console.error("Error adding guest scraping task:", error)
    return null
  }
}

/**
 * Get scraping tasks for guest user
 */
export function getGuestScrapingTasks(): ScrapingTask[] {
  const data = getGuestData()
  return data?.scraping_tasks || []
}

/**
 * Add a scraping result for guest user
 */
export function addGuestScrapingResult(
  taskId: string,
  data: any,
  status: "success" | "partial" | "failed" = "success",
  error?: string,
): string | null {
  try {
    const currentData = getGuestData() || {}
    const results = currentData.scraping_results || []

    // Generate a unique ID
    const id = `guest-result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newResult: ScrapingResult = {
      id,
      task_id: taskId,
      data,
      created_at: new Date().toISOString(),
      status,
      error,
    }

    const updatedResults = [...results, newResult]

    if (updateGuestData("scraping_results", updatedResults)) {
      return id
    }

    return null
  } catch (error) {
    console.error("Error adding guest scraping result:", error)
    return null
  }
}

/**
 * Get scraping results for guest user
 */
export function getGuestScrapingResults(taskId?: string): ScrapingResult[] {
  const data = getGuestData()
  const results = data?.scraping_results || []

  if (taskId) {
    return results.filter((result) => result.task_id === taskId)
  }

  return results
}

/**
 * Update guest user preferences
 */
export function updateGuestPreferences(preferences: Partial<UserPreferences>): boolean {
  try {
    const currentData = getGuestData() || {}
    const currentPreferences = currentData.preferences || {}

    const updatedPreferences = {
      ...currentPreferences,
      ...preferences,
    }

    return updateGuestData("preferences", updatedPreferences)
  } catch (error) {
    console.error("Error updating guest preferences:", error)
    return false
  }
}

/**
 * Get guest user preferences
 */
export function getGuestPreferences(): UserPreferences {
  const data = getGuestData()
  return (
    data?.preferences || {
      theme: "system",
      layout: "default",
      notifications_enabled: true,
      default_export_format: "json",
    }
  )
}

/**
 * Add a recent URL for guest user
 */
export function addGuestRecentUrl(url: string, title?: string): boolean {
  try {
    const currentData = getGuestData() || {}
    const recentUrls = currentData.recent_urls || []

    // Remove if already exists
    const filteredUrls = recentUrls.filter((item) => item.url !== url)

    // Add to the beginning of the array
    const newRecentUrl: RecentUrl = {
      url,
      title,
      visited_at: new Date().toISOString(),
    }

    // Keep only the 20 most recent URLs
    const updatedRecentUrls = [newRecentUrl, ...filteredUrls].slice(0, 20)

    return updateGuestData("recent_urls", updatedRecentUrls)
  } catch (error) {
    console.error("Error adding guest recent URL:", error)
    return false
  }
}

/**
 * Get recent URLs for guest user
 */
export function getGuestRecentUrls(): RecentUrl[] {
  const data = getGuestData()
  return data?.recent_urls || []
}

/**
 * Add a note for guest user
 */
export function addGuestNote(content: string, taskId?: string): string | null {
  try {
    const currentData = getGuestData() || {}
    const notes = currentData.notes || []

    // Generate a unique ID
    const id = `guest-note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const now = new Date().toISOString()
    const newNote: Note = {
      id,
      content,
      created_at: now,
      updated_at: now,
      task_id: taskId,
    }

    const updatedNotes = [...notes, newNote]

    if (updateGuestData("notes", updatedNotes)) {
      return id
    }

    return null
  } catch (error) {
    console.error("Error adding guest note:", error)
    return null
  }
}

/**
 * Update a note for guest user
 */
export function updateGuestNote(id: string, content: string): boolean {
  try {
    const currentData = getGuestData() || {}
    const notes = currentData.notes || []

    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          content,
          updated_at: new Date().toISOString(),
        }
      }
      return note
    })

    return updateGuestData("notes", updatedNotes)
  } catch (error) {
    console.error("Error updating guest note:", error)
    return false
  }
}

/**
 * Get notes for guest user
 */
export function getGuestNotes(taskId?: string): Note[] {
  const data = getGuestData()
  const notes = data?.notes || []

  if (taskId) {
    return notes.filter((note) => note.task_id === taskId)
  }

  return notes
}

/**
 * Add a template for guest user
 */
export function addGuestTemplate(name: string, selectors: string[]): string | null {
  try {
    const currentData = getGuestData() || {}
    const templates = currentData.templates || []

    // Generate a unique ID
    const id = `guest-template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newTemplate: Template = {
      id,
      name,
      selectors,
      created_at: new Date().toISOString(),
    }

    const updatedTemplates = [...templates, newTemplate]

    if (updateGuestData("templates", updatedTemplates)) {
      return id
    }

    return null
  } catch (error) {
    console.error("Error adding guest template:", error)
    return null
  }
}

/**
 * Get templates for guest user
 */
export function getGuestTemplates(): Template[] {
  const data = getGuestData()
  return data?.templates || []
}

/**
 * Export all guest data as JSON
 */
export function exportGuestData(): string {
  try {
    const data = getGuestData()
    return JSON.stringify(data, null, 2)
  } catch (error) {
    console.error("Error exporting guest data:", error)
    return ""
  }
}

/**
 * Import guest data from JSON
 */
export function importGuestData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData) as GuestData
    return setGuestData(data)
  } catch (error) {
    console.error("Error importing guest data:", error)
    return false
  }
}

/**
 * Get storage usage statistics
 */
export function getStorageStats() {
  try {
    const data = localStorage.getItem(GUEST_DATA_KEY) || ""
    const usedBytes = data.length
    const totalBytes = MAX_STORAGE_SIZE
    const percentUsed = (usedBytes / totalBytes) * 100

    return {
      usedBytes,
      totalBytes,
      percentUsed,
      usedMB: usedBytes / (1024 * 1024),
      totalMB: totalBytes / (1024 * 1024),
    }
  } catch (error) {
    console.error("Error calculating storage stats:", error)
    return {
      usedBytes: 0,
      totalBytes: MAX_STORAGE_SIZE,
      percentUsed: 0,
      usedMB: 0,
      totalMB: MAX_STORAGE_SIZE / (1024 * 1024),
    }
  }
}
