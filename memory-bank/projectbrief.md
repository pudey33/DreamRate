# DreamRate Project Brief

## Project Overview
DreamRate is a web application for sharing and rating dreams. Users can submit their dreams and rate/review other users' dreams.

## Core Requirements
- User authentication (email/phone via Supabase)
- Dream submission and storage
- Dream viewing and rating system
- Social features for discovering other users' dreams

## Current Task
Integrate Supabase dream data into the landing page by:
1. Fetching 10 random dreams using existing `getRandomDreams()` query
2. Displaying them as a scrollable list of DreamView components in the main content area
3. Keeping sidebar functionality separate (removing click interactions for now)
4. Transforming Supabase data structure to work with existing components

## Technology Stack
- Frontend: SvelteKit
- Backend: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- Styling: Custom CSS with CSS variables
