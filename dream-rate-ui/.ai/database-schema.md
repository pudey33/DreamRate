# Database Schema Documentation

## Overview
DreamRate uses PostgreSQL via Supabase with three main tables: `users`, `dreams`, and `reviews`.

---

## Tables

### 1. `dreams` Table

Stores dream content submitted by users.

#### Schema
```sql
CREATE TABLE dreams (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL,  -- References auth.users.id
  title TEXT NOT NULL,
  content TEXT NOT NULL,     -- Rich text dream content
  tags JSONB,                -- Array of tags like ["scary", "funny", "sexy"]
  is_draft BOOLEAN DEFAULT false,
  is_nsfw BOOLEAN DEFAULT false,
  
  -- Indexes
  INDEX idx_dreams_created_by (created_by),
  INDEX idx_dreams_created_at (created_at DESC),
  INDEX idx_dreams_tags USING GIN (tags)
);
```

#### TypeScript Interface
```typescript
export interface Dream {
  id: number
  created_at: string
  created_by: string
  title: string
  content: string
  tags?: string[] | null
}
```

#### Fields
- **id**: Auto-incrementing primary key
- **created_at**: Timestamp when dream was created
- **created_by**: User ID from Supabase Auth (foreign key to auth.users)
- **title**: Dream title/subject
- **content**: Full dream content (rich text stored as HTML or markdown)
- **tags**: JSONB array of emotional tags (optional)
- **is_draft**: Whether the dream is saved as a draft
- **is_nsfw**: Whether the dream contains NSFW content

#### Row Level Security (RLS) Policies

**Enable RLS**:
```sql
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
```

**Policies**:
```sql
-- Users can view all published dreams (not drafts)
CREATE POLICY "Dreams are viewable by everyone" 
ON dreams FOR SELECT
USING (is_draft = false);

-- Users can view their own dreams (including drafts)
CREATE POLICY "Users can view own dreams" 
ON dreams FOR SELECT
USING (auth.uid()::text = created_by);

-- Users can insert their own dreams
CREATE POLICY "Users can insert own dreams" 
ON dreams FOR INSERT
WITH CHECK (auth.uid()::text = created_by);

-- Users can update their own dreams
CREATE POLICY "Users can update own dreams" 
ON dreams FOR UPDATE
USING (auth.uid()::text = created_by);

-- Users can delete their own dreams
CREATE POLICY "Users can delete own dreams" 
ON dreams FOR DELETE
USING (auth.uid()::text = created_by);
```

---

### 2. `reviews` Table

Stores ratings and reviews for dreams.

#### Schema
```sql
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL,           -- References auth.users.id
  dream_id BIGINT NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
  review TEXT NOT NULL,               -- Text review/comment
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 10),
  ethics_rating INTEGER CHECK (ethics_rating IS NULL OR ethics_rating BETWEEN 1 AND 10),
  creativity_rating INTEGER CHECK (creativity_rating IS NULL OR creativity_rating BETWEEN 1 AND 10),
  writing_rating INTEGER CHECK (writing_rating IS NULL OR writing_rating BETWEEN 1 AND 10),
  
  -- Prevent duplicate reviews
  UNIQUE(created_by, dream_id),
  
  -- Indexes
  INDEX idx_reviews_dream_id (dream_id),
  INDEX idx_reviews_created_by (created_by),
  INDEX idx_reviews_created_at (created_at DESC)
);
```

#### TypeScript Interface
```typescript
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
```

#### Fields
- **id**: Auto-incrementing primary key
- **created_at**: Timestamp when review was created
- **created_by**: User ID who wrote the review
- **dream_id**: Foreign key to the dream being reviewed
- **review**: Text-based review/comment
- **overall_rating**: Required rating from 1-10
- **ethics_rating**: Optional ethics rating from 1-10
- **creativity_rating**: Optional creativity rating from 1-10
- **writing_rating**: Optional writing quality rating from 1-10

#### Constraints
- Users cannot review the same dream twice (UNIQUE constraint)
- All ratings must be between 1 and 10
- CASCADE delete: When a dream is deleted, all its reviews are deleted

#### Row Level Security (RLS) Policies

**Enable RLS**:
```sql
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

**Policies**:
```sql
-- Everyone can view all reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON reviews FOR SELECT
USING (true);

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews" 
ON reviews FOR INSERT
WITH CHECK (auth.uid()::text = created_by);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" 
ON reviews FOR UPDATE
USING (auth.uid()::text = created_by);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" 
ON reviews FOR DELETE
USING (auth.uid()::text = created_by);

-- Users cannot review their own dreams (application logic)
-- This should be enforced in the application layer
```

---

### 3. `users` Table (Managed by Supabase Auth)

Supabase automatically manages the `auth.users` table. You typically extend it with a public `profiles` table.

#### Optional: `profiles` Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  
  INDEX idx_profiles_username (username)
);
```

#### TypeScript Interface (if using profiles)
```typescript
export interface Profile {
  id: string
  created_at: string
  updated_at: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
}
```

---

## Relationships

```
auth.users (1) ──< (many) dreams
  └─> User can create multiple dreams

dreams (1) ──< (many) reviews
  └─> Each dream can have multiple reviews

auth.users (1) ──< (many) reviews
  └─> User can write multiple reviews
```

---

## Common Queries

### Get all dreams for a user
```sql
SELECT * FROM dreams 
WHERE created_by = 'user_id'
ORDER BY created_at DESC;
```

### Get a dream with all its reviews
```sql
SELECT 
  d.*,
  json_agg(r.*) as reviews
FROM dreams d
LEFT JOIN reviews r ON r.dream_id = d.id
WHERE d.id = dream_id
GROUP BY d.id;
```

### Get random dreams (excluding user's own)
```sql
SELECT * FROM dreams 
WHERE created_by != 'user_id' 
  AND is_draft = false
ORDER BY RANDOM()
LIMIT 10;
```

### Get average ratings for a dream
```sql
SELECT 
  dream_id,
  AVG(overall_rating) as avg_overall,
  AVG(ethics_rating) as avg_ethics,
  AVG(creativity_rating) as avg_creativity,
  AVG(writing_rating) as avg_writing,
  COUNT(*) as review_count
FROM reviews
WHERE dream_id = dream_id
GROUP BY dream_id;
```

---

## Future Enhancements

### Additional Tables (Planned)

1. **`dream_shares`** - Track shared dream links
2. **`dream_views`** - Analytics on dream views
3. **`user_follows`** - Follow other users
4. **`notifications`** - User notification system
5. **`dream_reports`** - Report inappropriate content

### Additional Fields (Planned)

- `dreams.view_count` - Track popularity
- `dreams.published_at` - Separate from created_at for drafts
- `reviews.is_helpful_count` - Community voting on helpful reviews
- `profiles.is_private` - Privacy settings

---

## Migration Notes

When making schema changes:

1. **Use Supabase Dashboard** or SQL Editor
2. **Always create migration files** for version control
3. **Update RLS policies** when adding new tables/fields
4. **Update TypeScript types** in `src/lib/supabase/types.ts`
5. **Test queries** before deploying to production

### Example Migration Command (if using Supabase CLI)
```bash
supabase db reset --local
supabase db push
```

---

## Performance Considerations

### Indexes
- **dreams**: Index on `created_by`, `created_at`, and `tags` (GIN index for JSONB)
- **reviews**: Index on `dream_id`, `created_by`, and `created_at`

### Query Optimization
- Use `.select()` with specific columns instead of `*` when possible
- Implement pagination for large result sets
- Consider materialized views for complex aggregations (average ratings)
- Use Supabase's built-in caching where appropriate

### Scaling Considerations
- Random dream selection may be slow with large datasets - consider implementing a "hot" dreams cache
- Tag searches on JSONB may need optimization at scale
- Consider partitioning the reviews table by date if it grows very large
