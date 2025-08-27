import { supabase } from './client.js'
import type { Dream, Review } from './types.js'

// Dream
export async function createDream(story: string): Promise<Dream> {
  const { data, error } = await supabase
    .from('dreams')
    .insert({
      story: story
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Dream
}

export async function updateDream(dreamId: number, story: string): Promise<Dream> {
  const { data, error } = await supabase
    .from('dreams')
    .update({ story })
    .eq('id', dreamId)
    .select()
    .single()
  
  if (error) throw error
  return data as Dream
}

export async function deleteDream(dreamId: number): Promise<void> {
  const { error } = await supabase
    .from('dreams')
    .delete()
    .eq('id', dreamId)
  
  if (error) throw error
}

// Review
export async function createReview(reviewData: {
  dream_id: number
  review: string
  overall_rating: number
  ethics_rating: number
  creativity_rating: number
  writing_rating: number
}): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select()
    .single()
  
  if (error) throw error
  return data as Review
}

export async function updateReview(
  reviewId: number, 
  reviewData: {
    review: string
    overall_rating: number
    ethics_rating: number
    creativity_rating: number
    writing_rating: number
  }
): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .update(reviewData)
    .eq('id', reviewId)
    .select()
    .single()
  
  if (error) throw error
  return data as Review
}

export async function deleteReview(reviewId: number): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
  
  if (error) throw error
}
