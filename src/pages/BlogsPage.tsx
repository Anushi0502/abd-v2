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
  if (loading) {
    return (
      <section className="page-state container">
        <h1>Loading blogs...</h1>
      </section>
    )
  }

  return (
    <section className="blogs-page">
      <div className="container enhanced-hero">
        <p className="eyebrow">Insights Hub</p>
        <h1>ABD Blogs</h1>
        <p>
          High-signal content on tax-aware planning, retirement confidence, and protection strategy.
        </p>
      </div>

      <div className="container card-grid">
        {posts.map((post) => (
          <article key={post.id} className="card-grid-item">
            <p className="card-date">{formatDate(post.date)}</p>
            <h2>{post.title}</h2>
            <p>{excerptForCard(post)}</p>
            <Link to={`/${post.slug}`} className="btn btn-outline">
              Read Article
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BlogsPage
