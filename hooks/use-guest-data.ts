"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getGuestData,
  updateGuestData,
  isGuestMode,
  initGuestStorage,
  type GuestData,
  getGuestScrapingTasks,
  getGuestScrapingResults,
  addGuestScrapingTask,
  addGuestScrapingResult,
  getGuestPreferences,
  updateGuestPreferences,
  getGuestRecentUrls,
  addGuestRecentUrl,
  getGuestNotes,
  addGuestNote,
  updateGuestNote,
  getGuestTemplates,
  addGuestTemplate,
  getStorageStats,
} from "@/lib/guest-storage"

/**
 * Hook for accessing and managing guest data
 */
export function useGuestData() {
  const [data, setData] = useState<GuestData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [storageStats, setStorageStats] = useState(getStorageStats())

  // Initialize guest storage on component mount
  useEffect(() => {
    if (isGuestMode()) {
      initGuestStorage()
      refreshData()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Refresh data from localStorage
  const refreshData = useCallback(() => {
    if (isGuestMode()) {
      setData(getGuestData())
      setStorageStats(getStorageStats())
    }
    setIsLoading(false)
  }, [])

  // Update a section of guest data
  const updateSection = useCallback(
    <K extends keyof GuestData>(section: K, newData: GuestData[K]) => {
      if (!isGuestMode()) return false

      const success = updateGuestData(section, newData)
      if (success) {
        refreshData()
      }
      return success
    },
    [refreshData],
  )

  // Tasks
  const tasks = useCallback(() => {
    return isGuestMode() ? getGuestScrapingTasks() : []
  }, [])

  const addTask = useCallback(
    (task: any) => {
      if (!isGuestMode()) return null
      const id = addGuestScrapingTask(task)
      refreshData()
      return id
    },
    [refreshData],
  )

  // Results
  const results = useCallback((taskId?: string) => {
    return isGuestMode() ? getGuestScrapingResults(taskId) : []
  }, [])

  const addResult = useCallback(
    (taskId: string, resultData: any, status?: "success" | "partial" | "failed", error?: string) => {
      if (!isGuestMode()) return null
      const id = addGuestScrapingResult(taskId, resultData, status, error)
      refreshData()
      return id
    },
    [refreshData],
  )

  // Preferences
  const preferences = useCallback(() => {
    return isGuestMode() ? getGuestPreferences() : {}
  }, [])

  const updatePreferences = useCallback(
    (newPreferences: any) => {
      if (!isGuestMode()) return false
      const success = updateGuestPreferences(newPreferences)
      if (success) {
        refreshData()
      }
      return success
    },
    [refreshData],
  )

  // Recent URLs
  const recentUrls = useCallback(() => {
    return isGuestMode() ? getGuestRecentUrls() : []
  }, [])

  const addRecentUrl = useCallback(
    (url: string, title?: string) => {
      if (!isGuestMode()) return false
      const success = addGuestRecentUrl(url, title)
      if (success) {
        refreshData()
      }
      return success
    },
    [refreshData],
  )

  // Notes
  const notes = useCallback((taskId?: string) => {
    return isGuestMode() ? getGuestNotes(taskId) : []
  }, [])

  const addNote = useCallback(
    (content: string, taskId?: string) => {
      if (!isGuestMode()) return null
      const id = addGuestNote(content, taskId)
      refreshData()
      return id
    },
    [refreshData],
  )

  const updateNote = useCallback(
    (id: string, content: string) => {
      if (!isGuestMode()) return false
      const success = updateGuestNote(id, content)
      if (success) {
        refreshData()
      }
      return success
    },
    [refreshData],
  )

  // Templates
  const templates = useCallback(() => {
    return isGuestMode() ? getGuestTemplates() : []
  }, [])

  const addTemplate = useCallback(
    (name: string, selectors: string[]) => {
      if (!isGuestMode()) return null
      const id = addGuestTemplate(name, selectors)
      refreshData()
      return id
    },
    [refreshData],
  )

  return {
    isGuest: isGuestMode(),
    data,
    isLoading,
    storageStats,
    refreshData,
    updateSection,
    tasks,
    addTask,
    results,
    addResult,
    preferences,
    updatePreferences,
    recentUrls,
    addRecentUrl,
    notes,
    addNote,
    updateNote,
    templates,
    addTemplate,
  }
}
