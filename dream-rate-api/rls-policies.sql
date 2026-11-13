-- Row Level Security (RLS) Setup for Dream Rating App
-- Run this script in your Supabase SQL Editor

-- First, enable RLS on both tables
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DREAMS TABLE RLS POLICIES
-- =====================================================

-- Policy 1: Users can view their own dreams (for "My Dreams" section)
CREATE POLICY "Users can view own dreams" ON dreams
  FOR SELECT 
  USING (auth.uid() = created_by);

-- Policy 2: Users can insert their own dreams
CREATE POLICY "Users can insert own dreams" ON dreams
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

-- Policy 3: Users can update their own dreams
CREATE POLICY "Users can update own dreams" ON dreams
  FOR UPDATE 
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Policy 4: Users can delete their own dreams
CREATE POLICY "Users can delete own dreams" ON dreams
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Policy 5: Users can view others' dreams for rating (excluding their own)
CREATE POLICY "Users can view others dreams for rating" ON dreams
  FOR SELECT 
  USING (auth.uid() != created_by);

-- =====================================================
-- REVIEWS TABLE RLS POLICIES
-- =====================================================

-- Policy 1: Users can view all reviews (to see ratings on dreams)
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT 
  USING (true);

-- Policy 2: Users can insert reviews (but not on their own dreams)
CREATE POLICY "Users can insert reviews" ON reviews
  FOR INSERT 
  WITH CHECK (
    auth.uid() = created_by 
    AND auth.uid() != (
      SELECT created_by FROM dreams WHERE id = dream_id
    )
  );

-- Policy 3: Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE 
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Policy 4: Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE 
  USING (auth.uid() = created_by);

-- =====================================================
-- ADDITIONAL CONSTRAINTS
-- =====================================================

-- Prevent duplicate reviews: One review per user per dream
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_dream_review 
ON reviews (created_by, dream_id);

-- Add check constraint to ensure rating values are within valid range
ALTER TABLE reviews 
ADD CONSTRAINT check_overall_rating 
CHECK (overall_rating >= 0 AND overall_rating <= 5);

ALTER TABLE reviews 
ADD CONSTRAINT check_ethics_rating 
CHECK (ethics_rating >= 0 AND ethics_rating <= 5);

ALTER TABLE reviews 
ADD CONSTRAINT check_creativity_rating 
CHECK (creativity_rating >= 0 AND creativity_rating <= 5);

ALTER TABLE reviews 
ADD CONSTRAINT check_writing_rating 
CHECK (writing_rating >= 0 AND writing_rating <= 5);

-- Add check constraint for dream content length
ALTER TABLE dreams 
ADD CONSTRAINT check_story_length 
CHECK (char_length(text) >= 250 AND char_length(text) <= 25000);

-- Add check constraint for review content length
ALTER TABLE reviews
ADD CONSTRAINT check_story_length
CHECK (char_length(content) >= 250 AND char_length(content) <= 25000);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these queries to verify your RLS policies are working:

-- 1. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('dreams', 'reviews');

-- 2. List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('dreams', 'reviews')
ORDER BY tablename, policyname;
