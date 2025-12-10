import { supabase } from './client.js'
import type { Dream, Review } from './types.js'

// Dream on, supaboi
export async function submitDream(title: string, content: string, created_by: string, tags?: string[]): Promise<Dream> {
  const { data, error } = await supabase
    .from('dreams')
    .insert({
      title: title,
      content: content,
      created_by: created_by,
      tags: tags || null
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Dream
}

export async function updateDream(dreamId: number, title: string, story: string): Promise<Dream> {
  const { data, error } = await supabase
    .from('dreams')
    .update({ title, story })
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
export async function submitReview(reviewData: {
  dream_id: number
  content: string
  overall_rating: number
  ethics_rating: number | null
  creativity_rating: number | null
  writing_rating: number | null
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
    ethics_rating: number | null
    creativity_rating: number | null
    writing_rating: number | null
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
