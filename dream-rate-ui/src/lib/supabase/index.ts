// Export client and types
export { supabase } from './client.js'
export type { Dream, Review } from './types.js'

// Export all queries (read operations)
export {
  getUserDreams,
  getRandomDream,
  getDreamWithReviews,
  getReviewsForDream,
  getUserReviews
} from './queries.js'

// Export all mutations (write operations)
export {
  createDream,
  updateDream,
  deleteDream,
  createReview,
  updateReview,
  deleteReview
} from './mutations.js'
