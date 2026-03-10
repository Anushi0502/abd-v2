import { useCallback, useEffect, useState } from 'react'
import { getFallbackContentIndex } from '../lib/fallbackContent'
import type { ContentState } from '../types'

interface UseContentIndexState extends ContentState {
  refresh: () => void
  lastUpdated: number | null
}

const initialState: ContentState = {
  pages: [],
  posts: [],
  loading: true,
  error: null,
}

export const useContentIndex = (): UseContentIndexState => {
  const [state, setState] = useState<ContentState>(initialState)
  const [refreshVersion, setRefreshVersion] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  const refresh = useCallback(() => {
    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }))
    setRefreshVersion((current) => current + 1)
  }, [])

  useEffect(() => {
    const content = getFallbackContentIndex()
    setState({
      ...content,
      loading: false,
      error: null,
    })
    setLastUpdated(Date.now())
  }, [refreshVersion])

  return {
    ...state,
    refresh,
    lastUpdated,
  }
}
