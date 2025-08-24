import { writable } from 'svelte/store'
import { supabase } from './supa-queries.js'
import type { User, Session } from '@supabase/supabase-js'

// Auth stores
export const user = writable<User | null>(null)
export const session = writable<Session | null>(null)
export const loading = writable(true)

// Initialize auth state
supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
  session.set(initialSession)
  user.set(initialSession?.user ?? null)
  loading.set(false)
})

// Listen for auth changes
supabase.auth.onAuthStateChange((event, newSession) => {
  session.set(newSession)
  user.set(newSession?.user ?? null)
  loading.set(false)
})

// Auth functions
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  getCurrentUser() {
    return supabase.auth.getUser()
  }
}
