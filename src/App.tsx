import { useMemo } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import { useContentIndex } from './hooks/useContentIndex'
import { resolveAliasSlug } from './lib/html'
import BlogsPage from './pages/blogs'
import DynamicPage from './pages/dynamic'
import { DYNAMIC_ROUTE_COMPONENTS } from './pages/dynamic/routeRegistry'
import HomePage from './pages/home'
import RetirementCalculatorPage from './pages/retirement'
import type { WpRecord } from './types'

interface DynamicRouteResolverProps {
  pages: WpRecord[]
  posts: WpRecord[]
  pageLookup: Map<string, WpRecord>
  postLookup: Map<string, WpRecord>
  loading: boolean
  error: string | null
}

const DynamicRouteResolver = ({
  pages,
  posts,
  pageLookup,
  postLookup,
  loading,
  error,
}: DynamicRouteResolverProps) => {
  const location = useLocation()
  const requestedSlug = location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase()
  const canonicalSlug = resolveAliasSlug(requestedSlug)

  if (!requestedSlug) {
    return <Navigate to="/home" replace />
  }

  if (canonicalSlug !== requestedSlug) {
    return <Navigate to={`/${canonicalSlug}`} replace />
  }

  if (canonicalSlug === 'blogs') {
    return <Navigate to="/blogs" replace />
  }

  const page = pageLookup.get(canonicalSlug) ?? null
  const post = postLookup.get(canonicalSlug) ?? null
  const entity = page ?? post ?? null

  return (
    <DynamicPage
      slug={canonicalSlug}
      entity={entity}
      loading={loading}
      error={error}
      suggestedPages={pages}
      posts={posts}
    />
  )
}

const AppShell = () => {
  const { pages, posts, loading, error, refresh, lastUpdated } = useContentIndex()
  const pageLookup = useMemo(() => {
    return new Map(pages.map((entry) => [entry.slug.toLowerCase(), entry]))
  }, [pages])
  const postLookup = useMemo(() => {
    return new Map(posts.map((entry) => [entry.slug.toLowerCase(), entry]))
  }, [posts])
  const dedicatedDynamicRoutes = useMemo(() => Object.entries(DYNAMIC_ROUTE_COMPONENTS), [])

  const homePage = pageLookup.get('home') ?? null
  const retirementCalculatorPage = pageLookup.get('retirement-calculator') ?? null
  const routeError = null
  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdated) {
      return null
    }

    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(lastUpdated)
  }, [lastUpdated])

  return (
    <Layout>
      {error && !loading && (
        <section className="container content-sync-banner" role="status">
          <p>Live sync is unavailable. Showing fallback content: {error}</p>
          <div className="content-sync-actions">
            <button type="button" className="btn btn-outline" onClick={refresh}>
              Retry Sync
            </button>
            {lastUpdatedLabel && <span>Last content refresh: {lastUpdatedLabel}</span>}
          </div>
        </section>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={<HomePage homePage={homePage} loading={loading} error={routeError} />}
        />
        <Route
          path="/retirement-calculator"
          element={
            <RetirementCalculatorPage
              entity={retirementCalculatorPage}
              loading={loading}
              error={routeError}
            />
          }
        />
        <Route path="/blogs" element={<BlogsPage posts={posts} loading={loading} />} />
        {dedicatedDynamicRoutes.map(([slug, RouteComponent]) => (
          <Route
            key={slug}
            path={`/${slug}`}
            element={
              <RouteComponent
                slug={slug}
                entity={pageLookup.get(slug) ?? postLookup.get(slug) ?? null}
                loading={loading}
                error={routeError}
                suggestedPages={pages}
                posts={posts}
              />
            }
          />
        ))}
        <Route
          path="*"
          element={
            <DynamicRouteResolver
              pages={pages}
              posts={posts}
              pageLookup={pageLookup}
              postLookup={postLookup}
              loading={loading}
              error={routeError}
            />
          }
        />
      </Routes>
    </Layout>
  )
}

const App = () => {
  return <AppShell />
}

export default App
