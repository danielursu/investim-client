"use client"

import { useEffect } from 'react'
import { ragQueryManager } from '@/lib/api/rag'

/**
 * Component that proactively warms the API on app load
 * This reduces cold start latency for the first user interaction
 */
export function APIWarmer() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    // Check if we've recently warmed the API (within last 5 minutes)
    const lastWarmTime = window.localStorage.getItem('lastAPIWarmTime')
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    
    if (lastWarmTime && parseInt(lastWarmTime) > fiveMinutesAgo) {
      console.log('API was recently warmed, skipping...')
      return
    }

    // Start warming after a short delay to not block initial render
    const warmTimer = setTimeout(async () => {
      console.log('Proactively warming API on app load...')
      try {
        await ragQueryManager.preWarm()
        window.localStorage.setItem('lastAPIWarmTime', Date.now().toString())
        console.log('API warmed successfully')
      } catch (error) {
        console.warn('Failed to warm API on app load:', error)
      }
    }, 1000)

    // Also warm when the app becomes visible after being in background
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const lastWarm = window.localStorage.getItem('lastAPIWarmTime')
        const tenMinutesAgo = Date.now() - 10 * 60 * 1000
        
        if (!lastWarm || parseInt(lastWarm) < tenMinutesAgo) {
          console.log('App became visible, warming API...')
          ragQueryManager.preWarm().then(() => {
            window.localStorage.setItem('lastAPIWarmTime', Date.now().toString())
          }).catch(console.warn)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearTimeout(warmTimer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // This component doesn't render anything
  return null
}