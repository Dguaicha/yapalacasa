/**
 * @fileoverview Supabase Client Configuration
 * @module services/supabase
 * @description Configures and exports the Supabase client instance for authentication,
 * database operations, and real-time subscriptions.
 *
 * @author Salvar Team
 * @version 1.0.0
 * @since 2024-03
 *
 * @requires @supabase/supabase-js
 * @requires @react-native-async-storage/async-storage
 * @requires react-native
 *
 * @example
 * ```typescript
 * import { supabase } from './services/supabase';
 *
 * // Query data
 * const { data, error } = await supabase
 *   .from('restaurants')
 *   .select('*');
 *
 * // Auth operations
 * const { data: { user } } = await supabase.auth.getUser();
 * ```
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

/**
 * Supabase project URL from environment variables
 * Format: https://<project-ref>.supabase.co
 * @constant {string}
 */
const supabaseUrl: string = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || '';

/**
 * Supabase anonymous/public API key from environment variables
 * Safe to expose in client-side code
 * @constant {string}
 */
const supabaseAnonKey: string = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

/**
 * Validates Supabase configuration on initialization
 * Logs critical error if credentials are missing
 * Application will not function without valid credentials
 */
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Salvar] CRITICAL ERROR: Missing Supabase environment variables.\n' +
    'Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in .env'
  );
}

/**
 * Configured Supabase client instance
 *
 * Features:
 * - **Authentication:** PKCE flow with automatic token refresh
 * - **Session Persistence:** Uses AsyncStorage on mobile, browser storage on web
 * - **Type Safety:** Fully typed with TypeScript
 * - **Security:** Row Level Security (RLS) enforced on all tables
 *
 * Authentication Configuration:
 * - `autoRefreshToken`: Automatically refreshes expired tokens
 * - `detectSessionInUrl`: Enables OAuth redirect handling on web
 * - `flowType: 'pkce'`: Secure OAuth flow (recommended for mobile)
 * - `persistSession`: Maintains session across app restarts
 * - `storage`: Platform-specific storage (AsyncStorage for native)
 *
 * @type {SupabaseClient}
 * @exports supabase - Primary Supabase client for database and auth operations
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    /**
     * Automatically refresh expired access tokens
     * Prevents users from being logged out unexpectedly
     */
    autoRefreshToken: true,

    /**
     * Detect and handle auth redirects in URL
     * Required for OAuth providers and email confirmation links
     * Only enabled on web platform
     */
    detectSessionInUrl: Platform.OS === 'web',

    /**
     * Proof Key for Code Exchange (PKCE) flow
     * Industry standard secure OAuth flow for mobile apps
     * Prevents authorization code interception attacks
     */
    flowType: 'pkce',

    /**
     * Persist session across app restarts
     * Uses platform-appropriate storage mechanism
     */
    persistSession: true,

    /**
     * Session storage implementation
     * - Web: Uses browser's localStorage (undefined = default)
     * - Native: Uses AsyncStorage for encrypted, persistent storage
     */
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
  },
});

/**
 * Type definitions for database tables
 * These ensure type safety when querying the database
 *
 * @namespace Database
 */
export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          name: string;
          city: string | null;
          address: string | null;
          region: 'Costa' | 'Sierra' | 'Oriente' | 'Galapagos' | null;
          // ... additional fields
        };
        Insert: {
          // Insert type definitions
        };
        Update: {
          // Update type definitions
        };
      };
      // ... other tables
    };
  };
}

/**
 * Security Notes:
 * - This client uses the ANON key, which is safe to expose client-side
 * - All database access is protected by Row Level Security (RLS) policies
 * - Service role key should NEVER be used in client-side code
 * - Use Supabase Edge Functions for operations requiring elevated privileges
 *
 * @security
 * Row Level Security Policies:
 * - Users can only read/write their own data
 * - Restaurant owners can only manage their own listings
 * - Anonymous users can only read public restaurant data
 */
