import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create storage object that works in both browser and preview environments
const createStorage = () => {
  const isPreview = window.location.hostname.includes('stackblitz.io') || 
                   window.location.hostname.includes('webcontainer.io');

  if (isPreview) {
    // Use sessionStorage in preview environment
    return window.sessionStorage;
  }
  
  // Use localStorage in production environment
  return window.localStorage;
};

// Log environment information
console.log('Initializing Supabase client...');
console.log('Current origin:', window.location.origin);
console.log('Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: createStorage(),
    storageKey: 'supabase.auth.token',
    flowType: 'pkce',
    debug: true,
    async onAuthStateChange(event, session) {
      console.log('Supabase auth state changed:', event);
      if (session) {
        console.log('Session user:', session.user?.email);
      }
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Test the connection
supabase.from('demo_requests').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Error connecting to Supabase:', error);
    } else {
      console.log('Successfully connected to Supabase');
    }
  })
  .catch(error => {
    console.error('Failed to connect to Supabase:', error);
  });