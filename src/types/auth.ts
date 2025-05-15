
import { Session, User } from "@supabase/supabase-js";

// Define the auth error types
export type AuthError = {
  type: 'email' | 'password' | 'session' | 'server' | 'general';
  message: string;
  details?: string;
  code?: string;
};

// Security context interface
export interface SecurityContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'github' | 'google') => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: any) => Promise<{ error: AuthError | null; data: any | null }>;
  refreshSession: () => Promise<void>;
  validatePassword: (password: string) => { valid: boolean; message?: string };
  validateEmail: (email: string) => { valid: boolean; message?: string };
  validateName: (name: string) => { valid: boolean; message?: string };
}
