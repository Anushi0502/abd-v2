import { useCallback, useEffect, useState } from 'react'
import { fetchContentIndex } from '../lib/wpApi'
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
    let isCancelled = false

    const load = async () => {
      try {
        const content = await fetchContentIndex({
          forceRefresh: refreshVersion > 0,
        })

        if (!isCancelled) {
          setState({
            ...content,
            loading: false,
            error: null,
          })
          setLastUpdated(Date.now())
        }
      } catch (error) {
        if (!isCancelled) {
          const message = error instanceof Error ? error.message : 'Unable to load website content.'

          setState((current) => ({
            pages: current.pages,
            posts: current.posts,
            loading: false,
            error: message,
          }))
        }
      }
    }

    void load()

    return () => {
      isCancelled = true
    }
  }, [refreshVersion])

  return {
    ...state,
    refresh,
    lastUpdated,
  }
}
