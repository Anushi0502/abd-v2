import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, plainTextFromHtml } from '../lib/html'
import type { WpRecord } from '../types'

interface BlogsPageProps {
  posts: WpRecord[]
  loading: boolean
}

const excerptForCard = (entry: WpRecord) => {
  const fromExcerpt = plainTextFromHtml(entry.excerpt)
  const fromContent = plainTextFromHtml(entry.content)
  const best = fromExcerpt || fromContent
  return best.length > 180 ? `${best.slice(0, 177)}...` : best
}

const BlogsPage = ({ posts, loading }: BlogsPageProps) => {
  const [query, setQuery] = useState('')

  const sortedPosts = useMemo(() => {
    return [...posts].sort((left, right) => {
      return new Date(right.date).getTime() - new Date(left.date).getTime()
    })
  }, [posts])

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return sortedPosts
    }

    return sortedPosts.filter((post) => {
      const title = post.title.toLowerCase()
      const excerpt = plainTextFromHtml(post.excerpt).toLowerCase()
      const content = plainTextFromHtml(post.content).toLowerCase()
      return title.includes(normalized) || excerpt.includes(normalized) || content.includes(normalized)
    })
  }, [query, sortedPosts])

  const featuredPost = filteredPosts[0] ?? null
  const remainingPosts = featuredPost ? filteredPosts.slice(1) : []

  if (loading) {
    return (
      <section className="page-state container">
        <h1>Loading blogs...</h1>
      </section>
    )
  }

  return (
    <section className="blogs-page">
      <div className="container enhanced-hero animate-in">
        <p className="eyebrow">Insights Hub</p>
        <h1>ABD Blogs</h1>
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
          <span>{filteredPosts.length} article(s)</span>
        </div>
      </div>

      {featuredPost ? (
        <article className="container blog-featured animate-in">
          <div>
            <p className="eyebrow">Featured</p>
            <h2>{featuredPost.title}</h2>
            <p>{excerptForCard(featuredPost)}</p>
            <div className="blog-featured-meta">
              <span>{formatDate(featuredPost.date)}</span>
              <Link to={`/${featuredPost.slug}`} className="btn btn-primary">
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
          {remainingPosts.map((post) => (
            <article key={post.id} className="card-grid-item animate-in">
              <p className="card-date">{formatDate(post.date)}</p>
              <h2>{post.title}</h2>
              <p>{excerptForCard(post)}</p>
              <Link to={`/${post.slug}`} className="btn btn-outline">
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
