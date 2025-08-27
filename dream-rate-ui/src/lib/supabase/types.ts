// Types for our database tables
export interface Dream {
  id: number
  created_at: string
  created_by: string
  story: string
}

export interface Review {
  id: number
  created_at: string
  created_by: string
  dream_id: number
  review: string
  overall_rating: number
  ethics_rating: number
  creativity_rating: number
  writing_rating: number
}
