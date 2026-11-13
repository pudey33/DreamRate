# Components Guide

This document provides an overview of all reusable Svelte components in the DreamRate application.

## Component Directory
All components are located in `src/components/`

---

## Core Components

### DreamCard

**File**: `src/components/DreamCard.svelte`

**Purpose**: Displays a dream in a compact card format, typically used in lists/grids.

**Props**:
```typescript
export let title: string        // Dream title
export let rating: number       // Rating value (0-5)
export let tags: Array<{        // Tag objects
  color: string
  text: string
}>
export let text: string         // Dream preview text (truncated)
export let date: string         // ISO date string
```

**Events**:
- `select` - Dispatched when the card is clicked
  - **Detail**: `{ title, rating, tags, text, date }`

**Features**:
- Hover effects with elevation change
- Keyboard accessible (Enter/Space to select)
- Text truncation (2-line clamp)
- Tag display
- Rating display
- ARIA labels for accessibility

**Usage Example**:
```svelte
<script>
  import DreamCard from './components/DreamCard.svelte'
  
  function handleSelect(event) {
    const dreamData = event.detail
    console.log('Selected dream:', dreamData)
  }
</script>

<DreamCard
  title="Flying Dream"
  rating={4.5}
  tags={[
    { color: '#7C3AED', text: 'surreal' },
    { color: '#059669', text: 'peaceful' }
  ]}
  text="I was soaring through clouds..."
  date="2024-01-15T10:30:00Z"
  on:select={handleSelect}
/>
```

**Styling**:
- Uses CSS custom properties (variables)
- Responsive shadow effects
- Smooth transitions

---

### DreamView

**File**: `src/components/DreamView.svelte`

**Purpose**: Full-view component for displaying a dream with all details and interaction options.

**Props**:
```typescript
export let dream: DreamData | null = null
export let currentUserId: string | null = null

interface DreamData {
  id?: number
  title: string
  date: string
  rating: number
  tags: Array<{ color: string; text: string }>
  text: string
  created_by?: string
}
```

**Events**:
- `rateChange` - Dispatched when user submits a new rating
  - **Detail**: `number` (new rating value 1-5)

**Features**:
- **Placeholder State**: Shows helpful message when no dream is selected
- **Formatted Date**: Displays human-readable date (e.g., "January 15, 2024")
- **Star Rating Display**: Visual star representation (★/☆)
- **Interactive Rating**: Click to edit rating (if not owner)
- **Owner Controls**: Shows Edit/Delete buttons if current user owns the dream
- **Action Buttons**:
  - Edit Dream (owner only)
  - Share
  - Delete (owner only)

**State Management**:
```svelte
let isEditingRating = false
let tempRating = 0
```

**Reactive Statements**:
```svelte
$: isOwner = currentUserId && dream?.created_by && currentUserId === dream.created_by
```

**Usage Example**:
```svelte
<script>
  import DreamView from './components/DreamView.svelte'
  
  let selectedDream = {
    id: 42,
    title: 'Space Journey',
    date: '2024-01-15T10:30:00Z',
    rating: 4,
    tags: [{ color: '#7C3AED', text: 'cosmic' }],
    text: 'I was floating through space...',
    created_by: 'user-123'
  }
  
  let currentUser = 'user-456'
  
  function handleRatingChange(event) {
    const newRating = event.detail
    console.log('New rating:', newRating)
    // Submit to database
  }
</script>

<DreamView
  dream={selectedDream}
  currentUserId={currentUser}
  on:rateChange={handleRatingChange}
/>
```

**Responsive Design**:
- Mobile-friendly layout
- Stacks action buttons vertically on small screens
- Adjusts meta layout for mobile

---

### DreamEntryModal

**File**: `src/components/DreamEntryModal.svelte`

**Purpose**: Modal dialog for creating and editing dreams.

**Expected Features** (based on project requirements):
- Rich text editor integration
- Title input
- Tag selection/creation
- Draft saving
- NSFW toggle
- Submit/Cancel actions

---

### LoginModal

**File**: `src/components/LoginModal.svelte`

**Purpose**: Modal dialog for user authentication.

**Expected Features**:
- Email/password login form
- Sign up form
- Form validation
- Error display
- Loading states
- Session handling

---

### Sidebar

**File**: `src/components/Sidebar.svelte`

**Purpose**: Navigation sidebar displaying user's dreams.

**Expected Features**:
- List of user's dreams (using DreamCard)
- Scrollable dream list
- New dream button
- User information display
- Collapsible on mobile

---

### Tag

**File**: `src/components/Tag.svelte`

**Purpose**: Small, styled label for categorizing dreams.

**Props**:
```typescript
export let color: string   // Background color (hex/rgb)
export let text: string    // Tag text content
```

**Features**:
- Customizable background color
- Automatic text contrast
- Pill-shaped design
- Small, compact size

**Usage Example**:
```svelte
<script>
  import Tag from './components/Tag.svelte'
</script>

<Tag color="#7C3AED" text="scary" />
<Tag color="#059669" text="peaceful" />
<Tag color="#DC2626" text="nightmare" />
```

**Common Tag Colors**:
- Purple (`#7C3AED`) - Surreal/Mystical
- Green (`#059669`) - Peaceful/Nature
- Red (`#DC2626`) - Scary/Nightmare
- Blue (`#2563EB`) - Sad/Water
- Yellow (`#F59E0B`) - Happy/Sunny
- Pink (`#EC4899`) - Romantic/Love
- Orange (`#EA580C`) - Energetic/Fire

---

### Toast

**File**: `src/components/Toast.svelte`

**Purpose**: Toast notification component for user feedback.

**Expected Features**:
- Success/error/info/warning variants
- Auto-dismiss after timeout
- Manual dismiss button
- Animation (slide in/out)
- Queue multiple toasts
- Positioning (top-right, bottom-right, etc.)

**Usage Pattern**:
```svelte
<script>
  import Toast from './components/Toast.svelte'
  
  let toastMessage = ''
  let toastType = 'success'
  let showToast = false
  
  function displayToast(message, type = 'success') {
    toastMessage = message
    toastType = type
    showToast = true
  }
</script>

{#if showToast}
  <Toast 
    message={toastMessage}
    type={toastType}
    on:dismiss={() => showToast = false}
  />
{/if}
```

---

## Component Patterns

### Using Svelte 5 Runes

All components should use Svelte 5's new reactivity system:

#### State
```svelte
<script>
  let count = $state(0)
  let user = $state({ name: 'John', age: 25 })
</script>
```

#### Props
```svelte
<script>
  let { title, rating = 0, tags = [] } = $props()
</script>
```

#### Derived State
```svelte
<script>
  let firstName = $state('John')
  let lastName = $state('Doe')
  
  let fullName = $derived(`${firstName} ${lastName}`)
</script>
```

#### Effects
```svelte
<script>
  let count = $state(0)
  
  $effect(() => {
    console.log('Count changed:', count)
  })
</script>
```

---

## Styling Conventions

### CSS Custom Properties

All components use CSS variables defined in `src/lib/style.css`:

```css
/* Colors */
--bg-primary
--bg-secondary
--bg-tertiary
--text-primary
--text-secondary
--text-muted
--border-color

/* Spacing */
--spacing
--item-spacing

/* Typography */
--smaller
--normal
--larger
--x-larger
--xx-larger

/* Border */
--rad (border-radius)
```

### Component-Specific Styles

Each component should:
1. Scope styles to the component
2. Use semantic class names (BEM-style encouraged)
3. Implement hover/focus states for interactive elements
4. Include transitions for smooth interactions
5. Be responsive (mobile-first approach)

---

## Accessibility

All components follow accessibility best practices:

### Interactive Elements
- **Keyboard Navigation**: Tab, Enter, Space
- **ARIA Labels**: Descriptive labels for screen readers
- **Role Attributes**: Proper semantic roles
- **Focus States**: Visible focus indicators

### Example (DreamCard)
```svelte
<div 
  class="dream-card" 
  on:click={handleClick} 
  on:keydown={handleKeydown} 
  role="button" 
  tabindex="0" 
  aria-label="Dream: {title}"
>
```

---

## Component Communication

### Parent to Child
Use props:
```svelte
<DreamCard title={dreamTitle} rating={dreamRating} />
```

### Child to Parent
Use event dispatchers:
```svelte
<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  
  function handleAction() {
    dispatch('eventName', { data: 'value' })
  }
</script>
```

### Sibling Components
Use stores or lift state to common parent:
```svelte
<script>
  import { writable } from 'svelte/store'
  
  const sharedData = writable(initialValue)
</script>
```

---

## Testing Components

### Component Testing Pattern
```typescript
import { render, fireEvent } from '@testing-library/svelte'
import DreamCard from './DreamCard.svelte'

test('DreamCard emits select event on click', async () => {
  const { getByRole, component } = render(DreamCard, {
    props: {
      title: 'Test Dream',
      rating: 4,
      tags: [],
      text: 'Content',
      date: '2024-01-01'
    }
  })
  
  const mockHandler = vi.fn()
  component.$on('select', mockHandler)
  
  const card = getByRole('button')
  await fireEvent.click(card)
  
  expect(mockHandler).toHaveBeenCalled()
})
```

---

## Future Components

### Planned Components

1. **ReviewCard** - Display individual reviews
2. **RatingInput** - Reusable rating input (1-10 scale)
3. **SearchBar** - Search/filter dreams
4. **Calendar** - Dream calendar view
5. **UserProfile** - User profile card
6. **ShareDialog** - Share dream dialog
7. **ConfirmDialog** - Confirmation modal
8. **ImageUpload** - Image upload component
9. **RichTextEditor** - Rich text editing (for dream content)
10. **FilterPanel** - Advanced filtering options

---

## Component Best Practices

1. **Keep Components Small**: Each component should have a single responsibility
2. **Props Validation**: Use TypeScript types for all props
3. **Error Boundaries**: Handle errors gracefully
4. **Performance**: Use `{#key}` blocks to control reactivity
5. **Reusability**: Design components to be reusable across the app
6. **Documentation**: Add JSDoc comments for complex components
7. **Naming**: Use descriptive, consistent naming conventions
8. **File Organization**: Group related components in subdirectories if needed
