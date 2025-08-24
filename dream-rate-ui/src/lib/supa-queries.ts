import { createClient } from '@supabase/supabase-js'
import { env } from '$env/dynamic/public'

const supabaseUrl = env.PUBLIC_SUPABASE_URL!
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

// API functions for dreams
export const dreamAPI = {
  // Store a new dream
  async create(story: string) {
    const { data, error } = await supabase
      .from('dreams')
      .insert({
        story: story
      })
      .select()
      .single()
    
    if (error) throw error
    return data as Dream
  },

  // Get user's own dreams
  async getUserDreams(userId: string) {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Dream[]
  },

  // Get a random dream for rating (excluding user's own dreams)
  async getRandomDream(userId: string) {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .neq('created_by', userId)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) throw error
    return data[0] as Dream | null
  },

  // Get dream with its reviews
  async getDreamWithReviews(dreamId: number) {
    const { data, error } = await supabase
      .from('dreams')
      .select(`
        *,
        reviews (*)
      `)
      .eq('id', dreamId)
      .single()
    
    if (error) throw error
    return data
  }
}

// API functions for reviews
export const reviewAPI = {
  // Create a new review
  async create(reviewData: {
    dream_id: number
    review: string
    overall_rating: number
    ethics_rating: number
    creativity_rating: number
    writing_rating: number
  }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single()
    
    if (error) throw error
    return data as Review
  },

  // Get reviews for a specific dream
  async getForDream(dreamId: number) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('dream_id', dreamId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Review[]
  },

  // Get user's reviews
  async getUserReviews(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        dreams (*)
      `)
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}
