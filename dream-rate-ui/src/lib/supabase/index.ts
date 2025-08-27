// Export client and types
export { supabase } from './client.js'
export type { Dream, Review } from './types.js'

// Export all queries (read operations)
export {
  getUserDreams,
  getRandomDreams,
  getDreamWithReviews,
  getReviewsForDream,
  getUserReviews
} from './queries.js'

// Export all mutations (write operations)
export {
  submitDream as createDream,
  updateDream,
  deleteDream,
  submitReview as createReview,
  updateReview,
  deleteReview
} from './mutations.js'
