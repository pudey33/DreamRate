import { supabase } from './client.js'
import type { Dream, Review } from './types.js'

// Dream
export async function getUserDreams(userId: string): Promise<Dream[]> {
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Dream[]
}

//This is a full sort on the dreams table. If we get a massive dataset eventually, then this should probably be a lambda function instead.
export async function getRandomDreams(userId: string, count: number): Promise<Dream[] | null> {
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .neq('created_by', userId)
    .order('RANDOM()')
    .limit(count)
  
  if (error) throw error
  return data as Dream[]
}

// this select uses the foreign key relationship b/w dreams and reviews to get reviews in the same query
export async function getDreamWithReviews(dreamId: number) {
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

// Reviews
export async function getReviewsForDream(dreamId: number): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('dream_id', dreamId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Review[]
}

export async function getUserReviews(userId: string) {
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
