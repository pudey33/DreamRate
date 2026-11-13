# Development Guide

A comprehensive guide for developers working on the DreamRate project.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Environment Setup](#environment-setup)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [Git Workflow](#git-workflow)
6. [Debugging](#debugging)
7. [Performance](#performance)
8. [Deployment](#deployment)

---

## Getting Started

### Prerequisites
- **Node.js**: v18+ (check with `node --version`)
- **npm**: v9+ (check with `npm --version`)
- **Git**: For version control
- **Supabase Account**: For backend services

### Initial Setup

1. **Clone the repository**:
```bash
git clone https://github.com/pudey33/DreamRate.git
cd dream-rate-ui
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables** (see [Environment Setup](#environment-setup))

4. **Start development server**:
```bash
npm run dev
```

5. **Open browser** to `http://localhost:5173` (default Vite port)

---

## Environment Setup

### Environment Variables

Create a `.env` file in the project root (never commit this file):

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Development overrides
VITE_DEV_MODE=true
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing
3. Navigate to **Settings** > **API**
4. Copy:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon/public key** → `PUBLIC_SUPABASE_ANON_KEY`

### Supabase Client Setup

The Supabase client is initialized in `src/lib/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (hot reload enabled)

# Type Checking
npm run check            # Run svelte-check for type errors
npm run check:watch      # Watch mode for type checking

# Building
npm run build            # Create production build
npm run preview          # Preview production build locally

# Preparation
npm run prepare          # Sync SvelteKit (runs on install)
```

### Development Server

The dev server runs on `http://localhost:5173` with:
- **Hot Module Replacement (HMR)**: Changes reflect instantly
- **TypeScript checking**: Type errors show in terminal
- **Source maps**: For easier debugging

### Project Structure

```
dream-rate-ui/
├── .ai/                        # AI context files
│   ├── project-overview.md
│   ├── common-subagents.md
│   ├── database-schema.md
│   ├── api-documentation.md
│   ├── components-guide.md
│   └── development-guide.md
├── src/
│   ├── components/             # Reusable Svelte components
│   ├── lib/
│   │   ├── supabase/          # Supabase integration
│   │   ├── auth.ts            # Auth utilities
│   │   ├── style.css          # Global styles
│   │   └── index.ts           # Library exports
│   ├── routes/                # SvelteKit routes
│   │   ├── +layout.svelte     # Root layout
│   │   └── +page.svelte       # Homepage
│   ├── app.html               # HTML template
│   └── app.d.ts               # TypeScript declarations
├── static/                     # Static assets
├── package.json
├── svelte.config.js           # SvelteKit config
├── tsconfig.json              # TypeScript config
└── vite.config.ts             # Vite config
```

---

## Code Standards

### TypeScript

#### Always Use Types
```typescript
// ✅ Good
interface User {
  id: string
  name: string
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Bad
function getUser(id) {
  // ...
}
```

#### Import Types Correctly
```typescript
// For type-only imports
import type { Dream, Review } from '$lib/supabase/types'

// For values
import { supabase } from '$lib/supabase/client'
```

### Svelte 5 Conventions

#### Use Runes for Reactivity
```svelte
<script lang="ts">
  // State
  let count = $state(0)
  
  // Props
  let { title, description = 'Default' } = $props()
  
  // Derived state
  let doubled = $derived(count * 2)
  
  // Effects
  $effect(() => {
    console.log('Count changed:', count)
  })
</script>
```

#### Avoid Legacy Reactivity
```svelte
<script>
  // ❌ Don't use legacy $ syntax
  $: doubled = count * 2
  
  // ✅ Use $derived rune
  let doubled = $derived(count * 2)
</script>
```

### Component Organization

Structure components from top to bottom:
1. Script tag with imports
2. Component logic (functions, state)
3. Template/markup
4. Styles

```svelte
<script lang="ts">
  // 1. Imports
  import { onMount } from 'svelte'
  import type { Dream } from '$lib/types'
  
  // 2. Props
  let { dream } = $props()
  
  // 3. State
  let isLoading = $state(false)
  
  // 4. Functions
  function handleClick() {
    // ...
  }
  
  // 5. Lifecycle
  onMount(() => {
    // ...
  })
</script>

<!-- 6. Template -->
<div class="container">
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <h1>{dream.title}</h1>
  {/if}
</div>

<!-- 7. Styles -->
<style>
  .container {
    padding: 1rem;
  }
</style>
```

### CSS Naming

Use BEM-style naming for clarity:

```css
/* Block */
.dream-card { }

/* Element */
.dream-card__title { }
.dream-card__content { }

/* Modifier */
.dream-card--featured { }
.dream-card--small { }
```

Or use semantic naming:
```css
.dream-header { }
.dream-title { }
.dream-rating { }
```

### File Naming
- Components: `PascalCase.svelte` (e.g., `DreamCard.svelte`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.ts` or `types.ts`
- Routes: `+page.svelte`, `+layout.svelte`

---

## Git Workflow

### Branch Naming
```bash
feature/dream-sharing      # New features
bugfix/rating-calculation  # Bug fixes
hotfix/auth-security       # Urgent fixes
refactor/component-cleanup # Code improvements
```

### Commit Messages

Follow conventional commits:
```bash
feat: add dream sharing functionality
fix: correct rating calculation bug
docs: update API documentation
style: format component files
refactor: simplify dream query logic
test: add tests for DreamCard component
chore: update dependencies
```

### Workflow
```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add my feature"

# 3. Push to remote
git push origin feature/my-feature

# 4. Create Pull Request on GitHub

# 5. After merge, update main
git checkout main
git pull origin main
```

---

## Debugging

### Browser DevTools

#### Console Logs
```typescript
// Development only logs
if (import.meta.env.DEV) {
  console.log('Debug info:', data)
}
```

#### Svelte DevTools
Install the Svelte DevTools browser extension for:
- Component inspection
- Store monitoring
- Event tracking

### Type Checking

Run type checker in watch mode:
```bash
npm run check:watch
```

### Common Issues

#### Issue: "Cannot find module"
**Solution**: Run `npm install` or check import paths

#### Issue: Environment variables not loading
**Solution**: 
1. Ensure `.env` exists in root
2. Prefix with `PUBLIC_` for client-side access
3. Restart dev server

#### Issue: Supabase client errors
**Solution**:
1. Check API keys in `.env`
2. Verify Supabase URL
3. Check RLS policies in Supabase dashboard

#### Issue: TypeScript errors in Svelte files
**Solution**: Run `npm run prepare` to sync SvelteKit

---

## Performance

### Best Practices

#### 1. Lazy Loading
```svelte
<script>
  import { onMount } from 'svelte'
  
  let HeavyComponent
  
  onMount(async () => {
    const module = await import('./HeavyComponent.svelte')
    HeavyComponent = module.default
  })
</script>

{#if HeavyComponent}
  <svelte:component this={HeavyComponent} />
{/if}
```

#### 2. Optimize Images
```html
<!-- Use appropriate formats and sizes -->
<img 
  src="/image.webp" 
  alt="Dream image"
  loading="lazy"
  width="400"
  height="300"
/>
```

#### 3. Pagination
```typescript
// Don't load all dreams at once
const PAGE_SIZE = 20

const { data } = await supabase
  .from('dreams')
  .select('*')
  .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
```

#### 4. Debounce Search
```typescript
import { debounce } from '$lib/utils'

const handleSearch = debounce((query: string) => {
  // Perform search
}, 300)
```

### Performance Monitoring

Check build size:
```bash
npm run build
# Check .svelte-kit/output for bundle sizes
```

Use Lighthouse for auditing:
1. Open DevTools
2. Go to Lighthouse tab
3. Run audit
4. Address issues

---

## Deployment

### Build for Production

```bash
npm run build
```

This creates optimized files in `.svelte-kit/output`

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect GitHub repo for automatic deployments.

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.svelte-kit/output
```

#### Traditional Hosting
1. Build: `npm run build`
2. Upload `.svelte-kit/output` contents
3. Configure server for SPA routing

### Environment Variables in Production

Set these in your deployment platform:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

### Pre-Deployment Checklist

- [ ] Run `npm run check` (no type errors)
- [ ] Run `npm run build` (builds successfully)
- [ ] Test production build locally (`npm run preview`)
- [ ] Update environment variables
- [ ] Check Supabase RLS policies
- [ ] Test authentication flow
- [ ] Verify API endpoints
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit

---

## Troubleshooting

### Clear Cache
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear SvelteKit cache
rm -rf .svelte-kit
npm run dev
```

### Database Issues

Check Supabase Dashboard:
1. **Table Editor**: Verify data structure
2. **SQL Editor**: Run manual queries
3. **Authentication**: Check user status
4. **Logs**: Review error logs

### Getting Help

1. **Documentation**:
   - [SvelteKit Docs](https://kit.svelte.dev/docs)
   - [Svelte 5 Docs](https://svelte.dev/docs/svelte/overview)
   - [Supabase Docs](https://supabase.com/docs)

2. **Community**:
   - Svelte Discord
   - Supabase Discord
   - Stack Overflow

3. **Project-Specific**:
   - Check `.ai/` folder documentation
   - Review GitHub issues
   - Ask team members

---

## Additional Resources

### Recommended VS Code Extensions
- **Svelte for VS Code** - Syntax highlighting and IntelliSense
- **Svelte Intellisense** - Auto-completion
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Thunder Client** - API testing

### Learning Resources
- [SvelteKit Tutorial](https://learn.svelte.dev/)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Useful Tools
- [Svelte REPL](https://svelte.dev/repl) - Test Svelte code
- [Supabase Studio](https://supabase.com/dashboard) - Database management
- [Can I Use](https://caniuse.com/) - Browser compatibility
