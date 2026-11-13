import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_SUPABASE_URL: {
		public: true,
		description: 'Supabase project URL'
	},
	PUBLIC_SUPABASE_ANON_KEY: {
		public: true,
		description: 'Supabase anonymous/public key'
	},
	PUBLIC_AUTH_METHOD: {
		public: true,
		description: "Authentication method: 'email' or 'phone' (defaults to 'phone')",
		schema: (value) => (value === 'email' ? 'email' : 'phone') as 'email' | 'phone'
	}
});
