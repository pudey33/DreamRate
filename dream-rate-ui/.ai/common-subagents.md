# Common Subagents for Svelte + Supabase Stack

When working with AI coding assistants on a Svelte + Supabase stack like DreamRate, these specialized contexts/subagents can help organize different aspects of development:

## 1. Database Schema Agent
**Focus**: PostgreSQL database design and optimization

**Responsibilities**:
- Designing and maintaining database schema
- Creating and managing RLS (Row Level Security) policies
- Writing and optimizing database migrations
- Setting up indexes for performance
- Handling database constraints and relationships
- Managing JSONB fields (like tags)

**Key Skills**:
- PostgreSQL best practices
- Supabase-specific features (RLS, triggers, functions)
- Query optimization
- Data modeling

---

## 2. Supabase Integration Agent
**Focus**: Supabase client configuration and services

**Responsibilities**:
- Setting up and configuring Supabase client
- Implementing authentication flows (sign up, login, logout, session mgmt)
- Managing real-time subscriptions
- Configuring Supabase Storage
- Working with Edge Functions
- Handling Supabase-specific error states

**Key Skills**:
- `@supabase/supabase-js` library
- Auth state management
- Real-time data synchronization
- Environment variable management

---

## 3. Svelte Component Agent
**Focus**: Building and maintaining Svelte components

**Responsibilities**:
- Creating reusable Svelte components
- Implementing Svelte 5 runes ($state, $derived, $effect, $props)
- Managing component reactivity patterns
- Handling component lifecycle
- Creating accessible components
- Component composition and props design

**Key Skills**:
- Svelte 5 syntax and features
- Component best practices
- Reactivity patterns
- Accessibility (a11y)

---

## 4. Type Safety Agent
**Focus**: TypeScript type definitions and type safety

**Responsibilities**:
- Generating TypeScript types from database schema
- Creating interfaces for components and utilities
- Implementing type guards
- Ensuring type safety across the stack
- Managing type exports and imports
- Handling union types and generics

**Key Skills**:
- TypeScript advanced features
- Supabase generated types
- Type inference patterns
- Generic type utilities

---

## 5. API/Query Agent
**Focus**: Data fetching and API interactions

**Responsibilities**:
- Writing optimized database queries
- Implementing CRUD operations
- Creating query hooks or utilities
- Handling loading and error states
- Implementing caching strategies
- Managing pagination and infinite scroll
- Optimizing data fetching patterns

**Key Skills**:
- Supabase query builder
- Async/await patterns
- Error handling
- Data transformation
- SQL query optimization

---

## 6. UI/UX Agent
**Focus**: User interface and experience design

**Responsibilities**:
- Implementing design systems
- Creating responsive layouts
- Ensuring accessibility compliance
- Building animations and transitions
- Managing CSS architecture
- Implementing dark/light modes
- Creating consistent spacing and typography

**Key Skills**:
- CSS/SCSS
- Responsive design
- Accessibility standards (WCAG)
- Animation libraries
- Design tokens

---

## 7. Testing Agent
**Focus**: Quality assurance and testing

**Responsibilities**:
- Writing unit tests for utilities and functions
- Creating component tests (Vitest + Testing Library)
- Implementing E2E tests (Playwright)
- Managing test fixtures and mocks
- Setting up CI/CD test pipelines
- Testing accessibility

**Key Skills**:
- Vitest or Jest
- Svelte Testing Library
- Playwright
- Test-driven development (TDD)

---

## 8. Performance Agent
**Focus**: Application optimization and performance

**Responsibilities**:
- Optimizing bundle size
- Implementing code splitting and lazy loading
- Managing image optimization
- Improving Core Web Vitals
- Analyzing and improving Lighthouse scores
- Implementing service workers/PWA features
- Optimizing client-side rendering

**Key Skills**:
- Vite configuration
- Performance profiling
- Bundle analysis
- Browser DevTools
- Performance budgets

---

## 9. Authentication & Security Agent
**Focus**: User authentication and application security

**Responsibilities**:
- Implementing auth flows
- Managing session persistence
- Handling password reset workflows
- Implementing OAuth providers
- Securing routes and API calls
- Managing CSRF protection
- Implementing rate limiting

**Key Skills**:
- Supabase Auth
- Security best practices
- JWT/session management
- HTTPS/CORS configuration

---

## 10. State Management Agent
**Focus**: Application state and data flow

**Responsibilities**:
- Managing global application state
- Implementing state persistence
- Creating context/stores for shared state
- Handling complex state updates
- Managing derived state
- Implementing undo/redo functionality

**Key Skills**:
- Svelte stores
- Svelte 5 runes
- State machine patterns
- Local storage integration

---

## How to Use Subagents

### Single-Agent Development
For small to medium projects, one AI can handle all aspects. But mentally organizing tasks by these categories helps focus on specific concerns.

### Multi-Agent Workflows (Advanced)
For complex features:
1. **Database Schema Agent** designs tables and RLS policies
2. **Type Safety Agent** generates TypeScript types
3. **API/Query Agent** creates data fetching functions
4. **Svelte Component Agent** builds UI components
5. **Testing Agent** writes tests for everything
6. **Performance Agent** optimizes the final implementation

### Context Switching
When working with a single AI assistant, you can explicitly ask it to "switch contexts" or "act as the Database Schema Agent" to focus its attention on specific aspects of the codebase.

### Prompt Engineering
Example: "As the API/Query Agent, create an optimized query to fetch dreams with their reviews, ensuring proper error handling and type safety."

This helps the AI understand the specific domain expertise and constraints relevant to the current task.
