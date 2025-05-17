
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";
import { SecurityContextType, AuthError } from "@/types/auth";
import { validateEmail, validatePassword, validateName } from "@/utils/authValidation";
import { useAuthOperations } from "@/hooks/useAuthOperations";

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
};

export const SecurityProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { fetchProfile, signIn: authSignIn, signUp: authSignUp, signInWithProvider: authProvider, updateProfile: authUpdateProfile } = useAuthOperations();

  // Initialize session
  useEffect(() => {
    console.log("Setting up auth listener in SecurityContext");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Fetch profile using setTimeout to prevent potential deadlock
        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id).then((profileData) => {
              setProfile(profileData);
              setLoading(false);
            });
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Session exists" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then((profileData) => {
          setProfile(profileData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Wrap the authSignIn function to update profile after successful login
  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    
    // If login was successful and we have a user, fetch their profile
    if (!result.error && user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
    
    return result;
  };

  // Logout with proper cleanup
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    // No need to set session/user to null as onAuthStateChange will handle that
  };

  // Wrap the authUpdateProfile function to update local state
  const updateProfile = async (updates: any): Promise<{ error: AuthError | null; data: any | null }> => {
    if (!user) {
      return { 
        error: { 
          type: 'session', 
          message: "No hay sesión activa" 
        },
        data: null
      };
    }
    
    const result = await authUpdateProfile(user.id, updates);
    
    // Update local profile state if successful
    if (!result.error) {
      setProfile({ ...profile, ...updates });
    }
    
    return result;
  };

  // Refresh session to prevent token expiration issues
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
    } catch (err) {
      console.error("Error refreshing session:", err);
    }
  };

  return (
    <SecurityContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp: authSignUp,
        signOut,
        signInWithProvider: authProvider,
        updateProfile,
        refreshSession,
        validatePassword,
        validateEmail,
        validateName
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};
