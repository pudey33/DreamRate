# API Documentation

This document covers all database queries and mutations available in the DreamRate application.

## Location
- **Queries**: `src/lib/supabase/queries.ts` (Read operations)
- **Mutations**: `src/lib/supabase/mutations.ts` (Write operations)
- **Types**: `src/lib/supabase/types.ts` (TypeScript interfaces)

---

## Queries (Read Operations)

### Dreams

#### `getUserDreams(userId: string): Promise<Dream[]>`
Fetches all dreams created by a specific user, ordered by most recent first.

**Parameters**:
- `userId` - The Supabase auth user ID

**Returns**: Array of Dream objects

**Example**:
```typescript
import { getUserDreams } from '$lib/supabase/queries'

const dreams = await getUserDreams('user-uuid-here')
```

**SQL Equivalent**:
```sql
SELECT * FROM dreams 
WHERE created_by = $1 
ORDER BY created_at DESC
```

---

#### `getRandomDreams(userId: string, count: number): Promise<Dream[] | null>`
Fetches random dreams from other users for the rating interface.

**Parameters**:
- `userId` - Current user's ID (to exclude their own dreams)
- `count` - Number of dreams to return

**Returns**: Array of Dream objects or null

**Note**: Currently fetches 3x the requested count and randomizes client-side. This is a temporary workaround and should be optimized for production with large datasets.

**Example**:
```typescript
import { getRandomDreams } from '$lib/supabase/queries'

// Get 10 random dreams to rate
const dreams = await getRandomDreams('user-uuid-here', 10)
```

**Performance Consideration**: With a large dataset, consider implementing server-side randomization using a Supabase Edge Function or PostgreSQL function.

---

#### `getDreamWithReviews(dreamId: number)`
Fetches a single dream along with all its associated reviews.

**Parameters**:
- `dreamId` - The dream's ID

**Returns**: Dream object with nested reviews array

**Example**:
```typescript
import { getDreamWithReviews } from '$lib/supabase/queries'

const dreamData = await getDreamWithReviews(42)
// dreamData.reviews contains all reviews for this dream
```

**SQL Equivalent**:
```sql
SELECT d.*, 
  json_agg(r.*) as reviews
FROM dreams d
LEFT JOIN reviews r ON r.dream_id = d.id
WHERE d.id = $1
GROUP BY d.id
```

---

### Reviews

#### `getReviewsForDream(dreamId: number): Promise<Review[]>`
Fetches all reviews for a specific dream, ordered by most recent first.

**Parameters**:
- `dreamId` - The dream's ID

**Returns**: Array of Review objects

**Example**:
```typescript
import { getReviewsForDream } from '$lib/supabase/queries'

const reviews = await getReviewsForDream(42)
```

---

#### `getUserReviews(userId: string)`
Fetches all reviews written by a specific user, including the associated dream data.

**Parameters**:
- `userId` - The user's ID

**Returns**: Array of Review objects with nested dream data

**Example**:
```typescript
import { getUserReviews } from '$lib/supabase/queries'

const myReviews = await getUserReviews('user-uuid-here')
// Each review includes the full dream object
```

---

## Mutations (Write Operations)

### Dreams

#### `submitDream(title: string, content: string, created_by: string, tags?: string[]): Promise<Dream>`
Creates a new dream entry.

**Parameters**:
- `title` - Dream title
- `content` - Dream content (rich text/HTML/markdown)
- `created_by` - User ID of the dream author
- `tags` - Optional array of tags (e.g., ["scary", "funny"])

**Returns**: The newly created Dream object

**Example**:
```typescript
import { submitDream } from '$lib/supabase/mutations'

const newDream = await submitDream(
  'A Strange Journey',
  '<p>I was flying over a city made of candy...</p>',
  'user-uuid-here',
  ['surreal', 'flying']
)
```

**Error Handling**:
```typescript
try {
  const dream = await submitDream(title, content, userId)
} catch (error) {
  console.error('Failed to submit dream:', error.message)
}
```

---

#### `updateDream(dreamId: number, title: string, story: string): Promise<Dream>`
Updates an existing dream.

**Parameters**:
- `dreamId` - The dream's ID
- `title` - Updated title
- `story` - Updated content

**Returns**: The updated Dream object

**Note**: There's a naming inconsistency here - the parameter is called `story` but the database field is `content`. This should be fixed for consistency.

**Example**:
```typescript
import { updateDream } from '$lib/supabase/mutations'

const updated = await updateDream(42, 'New Title', 'Updated content...')
```

**RLS**: Only the dream's author can update it (enforced by Row Level Security)

---

#### `deleteDream(dreamId: number): Promise<void>`
Deletes a dream and all its associated reviews (CASCADE).

**Parameters**:
- `dreamId` - The dream's ID

**Returns**: void

**Example**:
```typescript
import { deleteDream } from '$lib/supabase/mutations'

await deleteDream(42)
```

**RLS**: Only the dream's author can delete it (enforced by Row Level Security)

---

### Reviews

#### `submitReview(reviewData: {...}): Promise<Review>`
Creates a new review for a dream.

**Parameters** (as object):
- `dream_id` - ID of the dream being reviewed
- `review` - Text review/comment
- `overall_rating` - Required rating (1-10)
- `ethics_rating` - Optional ethics rating (1-10)
- `creativity_rating` - Optional creativity rating (1-10)
- `writing_rating` - Optional writing quality rating (1-10)

**Returns**: The newly created Review object

**Example**:
```typescript
import { submitReview } from '$lib/supabase/mutations'

const review = await submitReview({
  dream_id: 42,
  review: 'This dream was incredibly vivid and creative!',
  overall_rating: 9,
  ethics_rating: 8,
  creativity_rating: 10,
  writing_rating: 7
})
```

**Validation**:
- All ratings must be between 1-10 (enforced by database constraint)
- User cannot review the same dream twice (UNIQUE constraint)
- User should not be able to review their own dreams (enforce in UI)

---

#### `updateReview(reviewId: number, reviewData: {...}): Promise<Review>`
Updates an existing review.

**Parameters**:
- `reviewId` - The review's ID
- `reviewData` - Object containing updated fields (same as submitReview, minus dream_id)

**Returns**: The updated Review object

**Example**:
```typescript
import { updateReview } from '$lib/supabase/mutations'

const updated = await updateReview(123, {
  review: 'Updated my thoughts on this dream...',
  overall_rating: 8,
  ethics_rating: 7,
  creativity_rating: 9,
  writing_rating: 8
})
```

**RLS**: Only the review's author can update it

---

#### `deleteReview(reviewId: number): Promise<void>`
Deletes a review.

**Parameters**:
- `reviewId` - The review's ID

**Returns**: void

**Example**:
```typescript
import { deleteReview } from '$lib/supabase/mutations'

await deleteReview(123)
```

**RLS**: Only the review's author can delete it

---

## Error Handling

All query and mutation functions throw errors that should be caught and handled appropriately.

### Common Error Patterns

#### Basic Try-Catch
```typescript
try {
  const dreams = await getUserDreams(userId)
  // Handle success
} catch (error) {
  console.error('Error fetching dreams:', error)
  // Show error message to user
}
```

#### Supabase-Specific Errors
```typescript
import { supabase } from '$lib/supabase/client'

const { data, error } = await supabase
  .from('dreams')
  .select('*')

if (error) {
  // Check error code
  switch (error.code) {
    case 'PGRST116':
      console.error('No rows found')
      break
    case '23505':
      console.error('Duplicate entry')
      break
    default:
      console.error('Database error:', error.message)
  }
}
```

#### Display to User (Svelte Component)
```svelte
<script lang="ts">
  import { getUserDreams } from '$lib/supabase/queries'
  
  let dreams = $state([])
  let error = $state(null)
  let loading = $state(true)
  
  async function loadDreams() {
    try {
      loading = true
      dreams = await getUserDreams(userId)
    } catch (err) {
      error = err.message
    } finally {
      loading = false
    }
  }
</script>

{#if loading}
  <p>Loading dreams...</p>
{:else if error}
  <p class="error">Error: {error}</p>
{:else}
  <!-- Display dreams -->
{/if}
```

---

## Best Practices

### 1. Type Safety
Always import and use the TypeScript types:
```typescript
import type { Dream, Review } from '$lib/supabase/types'

const dream: Dream = await submitDream(...)
```

### 2. Authentication Check
Ensure user is authenticated before calling mutations:
```typescript
import { supabase } from '$lib/supabase/client'

const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  throw new Error('Must be logged in')
}

const dream = await submitDream(title, content, user.id)
```

### 3. Optimistic UI Updates
For better UX, update the UI optimistically before waiting for the server:
```typescript
// Add dream to local state immediately
dreams = [...dreams, tempDream]

try {
  // Then save to database
  const savedDream = await submitDream(...)
  // Replace temp with real data
  dreams = dreams.map(d => d.id === tempId ? savedDream : d)
} catch (error) {
  // Rollback on error
  dreams = dreams.filter(d => d.id !== tempId)
}
```

### 4. Pagination
For large datasets, implement pagination:
```typescript
const { data } = await supabase
  .from('dreams')
  .select('*')
  .range(0, 9) // First 10 items
  .order('created_at', { ascending: false })
```

### 5. Real-time Subscriptions
Subscribe to changes for live updates:
```typescript
const channel = supabase
  .channel('dream-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'dreams' },
    (payload) => {
      console.log('Change received!', payload)
      // Update local state
    }
  )
  .subscribe()

// Don't forget to unsubscribe
onDestroy(() => {
  supabase.removeChannel(channel)
})
```

---

## Known Issues and TODOs

### Issues
1. **Naming Inconsistency**: `updateDream()` uses parameter name `story` but database field is `content`
2. **Random Dreams Performance**: Client-side randomization doesn't scale well
3. **Missing created_by**: `submitReview()` doesn't include `created_by` field - needs to be added from auth context

### TODOs
- [ ] Add pagination support to all list queries
- [ ] Implement server-side random dream selection
- [ ] Add search/filter functions
- [ ] Create aggregate query for dream statistics
- [ ] Add query to check if user has already reviewed a dream
- [ ] Implement draft dream functionality
- [ ] Add NSFW filtering queries

---

## Testing

### Mock Data Example
```typescript
const mockDream: Dream = {
  id: 1,
  created_at: new Date().toISOString(),
  created_by: 'test-user-id',
  title: 'Test Dream',
  content: 'Dream content...',
  tags: ['test']
}
```

### Testing Queries
```typescript
import { describe, it, expect } from 'vitest'
import { getUserDreams } from '$lib/supabase/queries'

describe('getUserDreams', () => {
  it('should fetch user dreams', async () => {
    const dreams = await getUserDreams('test-user-id')
    expect(Array.isArray(dreams)).toBe(true)
  })
})
```
