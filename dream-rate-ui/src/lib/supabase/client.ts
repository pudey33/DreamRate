import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$app/env/public'

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
