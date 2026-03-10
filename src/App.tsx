import { useMemo } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import { resolveAliasSlug } from './lib/html'
import { useContentIndex } from './hooks/useContentIndex'
import BlogsPage from './pages/blogs'
import DynamicPage from './pages/dynamic'
import { DYNAMIC_ROUTE_COMPONENTS } from './pages/dynamic/routeRegistry'
import HomePage from './pages/home'
import RetirementCalculatorPage from './pages/retirement'
import type { WpRecord } from './types'

interface DynamicRouteResolverProps {
  pages: WpRecord[]
  posts: WpRecord[]
  loading: boolean
  error: string | null
}

const DynamicRouteResolver = ({ pages, posts, loading, error }: DynamicRouteResolverProps) => {
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

  const page = pages.find((entry) => entry.slug === canonicalSlug)
  const post = posts.find((entry) => entry.slug === canonicalSlug)
  const entity = page ?? post ?? null

  return (
    <DynamicPage
      slug={canonicalSlug}
      entity={entity}
      loading={loading}
      error={error}
      suggestedPages={pages}
    />
  )
}

const AppShell = () => {
  const { pages, posts, loading, error } = useContentIndex()

  const pageBySlug = useMemo(() => {
    return new Map(pages.map((entry) => [entry.slug, entry]))
  }, [pages])

  const postBySlug = useMemo(() => {
    return new Map(posts.map((entry) => [entry.slug, entry]))
  }, [posts])

  const dedicatedDynamicRoutes = useMemo(() => {
    return Object.entries(DYNAMIC_ROUTE_COMPONENTS)
  }, [])

  const homePage = pages.find((entry) => entry.slug === 'home') ?? null
  const retirementCalculatorPage =
    pages.find((entry) => entry.slug === 'retirement-calculator') ?? null

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage homePage={homePage} loading={loading} error={error} />} />
        <Route
          path="/retirement-calculator"
          element={
            <RetirementCalculatorPage
              entity={retirementCalculatorPage}
              loading={loading}
              error={error}
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
                entity={pageBySlug.get(slug) ?? postBySlug.get(slug) ?? null}
                loading={loading}
                error={error}
                suggestedPages={pages}
              />
            }
          />
        ))}
        <Route
          path="*"
          element={<DynamicRouteResolver pages={pages} posts={posts} loading={loading} error={error} />}
        />
      </Routes>
    </Layout>
  )
}

const App = () => {
  return <AppShell />
}

export default App
