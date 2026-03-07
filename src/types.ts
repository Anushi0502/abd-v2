export type ContentType = 'page' | 'post'

export interface WpRecord {
  id: number
  slug: string
  link: string
  title: string
  excerpt: string
  content: string
  date: string
  modified: string
  type: ContentType
}

export interface ContentIndex {
  pages: WpRecord[]
  posts: WpRecord[]
}

export interface ContentState extends ContentIndex {
  loading: boolean
  error: string | null
}
