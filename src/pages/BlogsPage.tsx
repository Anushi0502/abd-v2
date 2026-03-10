import { useDeferredValue, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, plainTextFromHtml } from '../lib/html'
import type { WpRecord } from '../types'

interface BlogsPageProps {
  posts: WpRecord[]
  loading: boolean
}

interface IndexedPost {
  post: WpRecord
  summary: string
  searchableText: string
  timestamp: number
}

const buildSummary = (excerpt: string, content: string) => {
  const best = excerpt || content
  return best.length > 180 ? `${best.slice(0, 177)}...` : best
}

const buildIndexEntry = (post: WpRecord): IndexedPost => {
  const excerptText = plainTextFromHtml(post.excerpt)
  const contentText = plainTextFromHtml(post.content)
  const timestamp = new Date(post.date).getTime()

  return {
    post,
    summary: buildSummary(excerptText, contentText),
    searchableText: `${post.title} ${excerptText} ${contentText}`.toLowerCase(),
    timestamp: Number.isNaN(timestamp) ? 0 : timestamp,
  }
}

const BlogsPage = ({ posts, loading }: BlogsPageProps) => {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const indexedPosts = useMemo(() => {
    return posts
      .map((post) => buildIndexEntry(post))
      .sort((left, right) => right.timestamp - left.timestamp)
  }, [posts])

  const filteredPosts = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()
    if (!normalized) {
      return indexedPosts
    }

    return indexedPosts.filter((entry) => entry.searchableText.includes(normalized))
  }, [deferredQuery, indexedPosts])

  const featuredPost = filteredPosts[0] ?? null
  const remainingPosts = featuredPost ? filteredPosts.slice(1) : []
  const resultsLabel = `${filteredPosts.length} ${filteredPosts.length === 1 ? 'article' : 'articles'}`

  if (loading) {
    return (
      <section className="page-state container">
        <h1>Loading blogs...</h1>
      </section>
    )
  }

  return (
    <section className="blogs-page page2026 page2026-blogs">
      <div className="container enhanced-hero page2026-hero animate-in">
        <p className="eyebrow">Insights Hub</p>
        <h1>ABD Strategy Insights</h1>
        <p>
          High-signal content on tax-aware planning, retirement confidence, and protection strategy.
        </p>

        <div className="blogs-toolbar">
          <label htmlFor="blog-search">Search Articles</label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by topic, service, or keyword"
          />
          <span>{resultsLabel}</span>
        </div>
      </div>

      {featuredPost ? (
        <article className="container blog-featured animate-in">
          <div>
            <p className="eyebrow">Featured</p>
            <h2>{featuredPost.post.title}</h2>
            <p>{featuredPost.summary}</p>
            <div className="blog-featured-meta">
              <span>{formatDate(featuredPost.post.date)}</span>
              <Link to={`/${featuredPost.post.slug}`} className="btn btn-primary">
                Read Featured Article
              </Link>
            </div>
          </div>
        </article>
      ) : (
        <section className="container page-state">
          <h1>No results found</h1>
          <p>Try a broader search term to see more ABD content.</p>
        </section>
      )}

      {remainingPosts.length > 0 && (
        <div className="container card-grid">
          {remainingPosts.map((entry) => (
            <article key={entry.post.id} className="card-grid-item animate-in">
              <p className="card-date">{formatDate(entry.post.date)}</p>
              <h2>{entry.post.title}</h2>
              <p>{entry.summary}</p>
              <Link to={`/${entry.post.slug}`} className="btn btn-outline">
                Read Article
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default BlogsPage
