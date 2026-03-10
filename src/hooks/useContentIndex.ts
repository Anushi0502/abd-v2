import { useCallback, useState } from 'react'
import { getRestoredContentIndex } from '../data/restoredContent'
import { getFallbackContentIndex } from '../lib/fallbackContent'
import type { ContentState, WpRecord } from '../types'

interface UseContentIndexState extends ContentState {
  refresh: () => void
  lastUpdated: number | null
}

const mergeBySlug = (primary: WpRecord[], secondary: WpRecord[]): WpRecord[] => {
  const map = new Map<string, WpRecord>()

  for (const item of secondary) {
    map.set(item.slug.toLowerCase(), item)
  }

  for (const item of primary) {
    map.set(item.slug.toLowerCase(), item)
  }

  return Array.from(map.values())
}

const initialState = (): ContentState => {
  const restored = getRestoredContentIndex()
  const fallback = getFallbackContentIndex()
  const content = {
    pages: mergeBySlug(restored.pages, fallback.pages),
    posts: mergeBySlug(restored.posts, fallback.posts),
  }

  return {
    ...content,
    loading: false,
    error: null,
  }
}

export const useContentIndex = (): UseContentIndexState => {
  const [state, setState] = useState<ContentState>(() => initialState())
  const [lastUpdated, setLastUpdated] = useState<number | null>(() => Date.now())

  const refresh = useCallback(() => {
    setState(initialState())
    setLastUpdated(Date.now())
  }, [])

  return {
    ...state,
    refresh,
    lastUpdated,
  }
}
