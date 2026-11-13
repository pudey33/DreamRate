# DreamRate - Project Overview

## Purpose
A social platform for users to share their dreams and receive ratings/reviews from other users, similar to a "Hot or Not" format but for dream content.

## Tech Stack

### Frontend
- **Framework**: SvelteKit 2.x with Svelte 5
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Styling**: Custom CSS

### Backend
- **BaaS**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (cookie-based or username/password)
- **Real-time**: Supabase Realtime capabilities

## Core Features

### 1. User Management
- Cookie-based sessions or username/password authentication
- User profiles linked to dreams and reviews

### 2. Dream Rating System
- "Hot or Not" style interface on homepage
- Navigate through dreams (next/prev)
- Multi-dimensional rating system:
  - Overall rating (number)
  - Ethics rating (number, optional)
  - Creativity rating (number, optional)
  - Writing rating (number, optional)
  - Text-based review comments

### 3. Dream Entry
- Modal or separate page for dream creation
- Rich text editor integration options:
  - `@valiantlynx/svelte-rich-text`
  - Tiptap with Svelte
  - TinyMCE Svelte integration
  - Flowbite-Svelte WYSIWYG

### 4. Dream Recall/Viewing
- Personal dream library per user
- View dreams with associated reviews/comments
- Comment system below each dream

### 5. Dream Sharing
- Generate shareable URLs for individual dreams
- Optional: Temporary URLs that redirect to main site

### 6. Dream Drafts
- Save incomplete dreams for later editing

## Planned/Maybe Features

### Dream Calendar
- Visual calendar showing dreams by date
- Helps track dream patterns over time

### Dream Tags
- Emotional categorization (scary, sexy, funny, etc.)
- Tag-based filtering and discovery

### NSFW Filter
- Content warning system
- User preferences for content filtering

## Database Schema

### Tables
1. **users** - User account information
2. **dreams** - Dream content and metadata
3. **reviews** - Rating and review data for dreams

See `database-schema.md` for detailed schema information.

## Project Structure

```
src/
├── components/          # Reusable Svelte components
│   ├── DreamCard.svelte
│   ├── DreamEntryModal.svelte
│   ├── DreamView.svelte
│   ├── LoginModal.svelte
│   ├── Sidebar.svelte
│   ├── Tag.svelte
│   └── Toast.svelte
├── lib/
│   ├── auth.ts         # Authentication utilities
│   ├── style.css       # Global styles
│   ├── supabase/       # Supabase integration
│   │   ├── client.ts   # Supabase client setup
│   │   ├── queries.ts  # Database query functions
│   │   ├── mutations.ts # Database mutation functions
│   │   └── types.ts    # TypeScript type definitions
│   └── assets/         # Static assets
└── routes/             # SvelteKit routes
    ├── +layout.svelte  # Root layout
    └── +page.svelte    # Homepage

```
## Development Workflow

1. **Local Development**: `npm run dev` - Starts Vite dev server
2. **Type Checking**: `npm run check` - Runs svelte-check
3. **Building**: `npm run build` - Creates production build
4. **Preview**: `npm run preview` - Preview production build

## Key Considerations

- **Authentication**: Currently implementing cookie-based auth
- **Data Privacy**: User dreams should be private by default
- **Performance**: Random dream selection may need optimization at scale
- **Rich Text**: Need to select and implement a rich text editor
- **Routing**: Using SvelteKit's file-based routing
- **State Management**: Leveraging Svelte's built-in reactivity
