import { useEffect, useState } from 'react'
import { fetchContentIndex } from '../lib/wpApi'
import type { ContentState } from '../types'

const initialState: ContentState = {
  pages: [],
  posts: [],
  loading: true,
  error: null,
}

export const useContentIndex = () => {
  const [state, setState] = useState<ContentState>(initialState)

  useEffect(() => {
    let isCancelled = false

    const load = async () => {
      try {
        const content = await fetchContentIndex()
        if (!isCancelled) {
          setState({ ...content, loading: false, error: null })
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            pages: [],
            posts: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Unable to load website content.',
          })
        }
      }
    }

    void load()

    return () => {
      isCancelled = true
    }
  }, [])

  return state
}
