
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";

// Define the auth error types
export type AuthError = {
  type: 'email' | 'password' | 'session' | 'server' | 'general';
  message: string;
  details?: string;
  code?: string;
};

// Security context interface
interface SecurityContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error: AuthError | null; data: any | null }>;
  refreshSession: () => Promise<void>;
  validatePassword: (password: string) => { valid: boolean; message?: string };
  validateEmail: (email: string) => { valid: boolean; message?: string };
  validateName: (name: string) => { valid: boolean; message?: string };
}

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

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      return null;
    }
  };

  // Initialize session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
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

  // Password validation following best practices
  const validatePassword = (password: string) => {
    if (!password) {
      return { valid: false, message: "La contraseña es obligatoria" };
    }
    if (password.length < 8) {
      return { valid: false, message: "La contraseña debe tener al menos 8 caracteres" };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: "La contraseña debe contener al menos una letra mayúscula" };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: "La contraseña debe contener al menos una letra minúscula" };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: "La contraseña debe contener al menos un número" };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return { valid: false, message: "La contraseña debe contener al menos un carácter especial" };
    }
    return { valid: true };
  };

  // Email validation
  const validateEmail = (email: string) => {
    if (!email) {
      return { valid: false, message: "El correo electrónico es obligatorio" };
    }
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: "El correo electrónico no es válido" };
    }
    return { valid: true };
  };

  // Name validation
  const validateName = (name: string) => {
    if (!name) {
      return { valid: false, message: "El nombre es obligatorio" };
    }
    
    if (name.length < 2) {
      return { valid: false, message: "El nombre debe tener al menos 2 caracteres" };
    }
    
    if (name.length > 50) {
      return { valid: false, message: "El nombre no debe exceder los 50 caracteres" };
    }
    
    return { valid: true };
  };

  // Login function with improved error handling
  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    // Validate inputs first
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { 
        error: { 
          type: 'email' as const, 
          message: emailValidation.message || "Email inválido"
        } 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = "Error al iniciar sesión";
        let errorType: AuthError['type'] = 'general';

        // Determine more specific error messages
        if (error.message.includes("Invalid login")) {
          errorMessage = "Correo o contraseña incorrectos";
          errorType = 'password';
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Correo no confirmado. Revisa tu bandeja de entrada.";
          errorType = 'email';
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Demasiados intentos. Inténtalo más tarde.";
          errorType = 'server';
        }

        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: errorMessage,
        });

        return { 
          error: { 
            type: errorType, 
            message: errorMessage, 
            details: error.message, 
            code: error.code 
          } 
        };
      }

      // Success - update profile
      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
      }

      return { error: null };
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error del servidor",
        description: "Hubo un problema al conectarse al servidor",
      });

      return { 
        error: { 
          type: 'server', 
          message: "Error del servidor", 
          details: err.message 
        } 
      };
    }
  };

  // Registration function with robust validation
  const signUp = async (email: string, password: string, name: string): Promise<{ error: AuthError | null }> => {
    // Validate all inputs first
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { 
        error: { 
          type: 'email' as const, 
          message: emailValidation.message || "Email inválido"
        } 
      };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { 
        error: { 
          type: 'password' as const, 
          message: passwordValidation.message || "Contraseña inválida"
        } 
      };
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return { 
        error: { 
          type: 'general' as const, 
          message: nameValidation.message || "Nombre inválido"
        } 
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        let errorMessage = "Error al registrarse";
        let errorType: AuthError['type'] = 'general';

        // Determine more specific error messages
        if (error.message.includes("already registered")) {
          errorMessage = "Este correo ya está registrado";
          errorType = 'email';
        } else if (error.message.includes("password")) {
          errorMessage = "La contraseña no cumple con los requisitos";
          errorType = 'password';
        }

        toast({
          variant: "destructive",
          title: "Error de registro",
          description: errorMessage,
        });

        return { 
          error: { 
            type: errorType, 
            message: errorMessage, 
            details: error.message, 
            code: error.code 
          } 
        };
      }

      // Create user profile after successful registration
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              name: name,
              level: 1.0,
            },
          ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      toast({
        title: "Cuenta creada",
        description: "Tu cuenta ha sido creada exitosamente",
      });

      return { error: null };
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error del servidor",
        description: "Hubo un problema al conectarse al servidor",
      });

      return { 
        error: { 
          type: 'server' as const, 
          message: "Error del servidor", 
          details: err.message 
        } 
      };
    }
  };

  // Logout with proper cleanup
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    // No need to set session/user to null as onAuthStateChange will handle that
  };

  // Update user profile
  const updateProfile = async (updates: any): Promise<{ error: AuthError | null; data: any | null }> => {
    if (!user) {
      return { 
        error: { 
          type: 'session' as const, 
          message: "No hay sesión activa" 
        },
        data: null
      };
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al actualizar perfil",
          description: error.message,
        });
        
        return { 
          error: { 
            type: 'server' as const, 
            message: "Error al actualizar perfil", 
            details: error.message 
          },
          data: null
        };
      }

      // Update local profile state
      setProfile({ ...profile, ...updates });
      
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado exitosamente",
      });

      return { error: null, data: data[0] };
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error del servidor",
        description: "Hubo un problema al conectarse al servidor",
      });

      return { 
        error: { 
          type: 'server' as const, 
          message: "Error del servidor", 
          details: err.message 
        },
        data: null
      };
    }
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
        signUp,
        signOut,
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
