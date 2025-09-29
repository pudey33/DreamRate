// Types for our database tables
export interface Dream {
  id: number
  created_at: string
  created_by: string
  title: string
  content: string // Changed from 'story' to 'content' to match database schema
  tags?: string[] | null // JSONB tags column
}

export interface Review {
  id: number
  created_at: string
  created_by: string
  dream_id: number
  review: string
  overall_rating: number
  ethics_rating: number | null
  creativity_rating: number | null
  writing_rating: number | null
}
