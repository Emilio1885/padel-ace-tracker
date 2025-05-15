
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@/types/auth";
import { validateEmail, validatePassword, validateName } from "@/utils/authValidation";
import { useToast } from "@/hooks/use-toast";

export const useAuthOperations = () => {
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

  // Login function with improved error handling and debugging
  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    console.log("Attempting to sign in with:", email);
    
    // Validate inputs first
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { 
        error: { 
          type: 'email', 
          message: emailValidation.message || "Email inválido"
        } 
      };
    }

    try {
      // Log the sign-in attempt
      console.log("Calling Supabase signInWithPassword");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase login error:", error.message, error.code);
        
        let errorMessage = "Error al iniciar sesión";
        let errorType: AuthError['type'] = 'general';

        // Determine more specific error messages
        if (error.message.includes("Invalid login") || error.message.includes("invalid")) {
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

      console.log("Login successful:", data.user?.id);
      
      return { error: null };
    } catch (err: any) {
      console.error("Unexpected error during login:", err);
      
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
    console.log("Attempting to sign up with:", email);
    
    // Validate all inputs first
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { 
        error: { 
          type: 'email', 
          message: emailValidation.message || "Email inválido"
        } 
      };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { 
        error: { 
          type: 'password', 
          message: passwordValidation.message || "Contraseña inválida"
        } 
      };
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return { 
        error: { 
          type: 'general', 
          message: nameValidation.message || "Nombre inválido"
        } 
      };
    }

    try {
      console.log("Calling Supabase signUp");
      
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
        console.error("Supabase signup error:", error.message, error.code);
        
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

      console.log("Signup successful, creating profile for:", data.user?.id);
      
      // Create user profile after successful registration
      if (data.user) {
        try {
          console.log("Creating profile in database");
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
          } else {
            console.log("Profile created successfully");
          }
        } catch (profileErr) {
          console.error("Exception when creating profile:", profileErr);
        }
      }

      toast({
        title: "Cuenta creada",
        description: "Tu cuenta ha sido creada exitosamente",
      });

      return { error: null };
    } catch (err: any) {
      console.error("Unexpected error during signup:", err);
      
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

  // Social login function for GitHub and Google
  const signInWithProvider = async (provider: 'github' | 'google'): Promise<{ error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        const errorMessage = `Error al iniciar sesión con ${provider}`;
        const errorType: AuthError['type'] = 'general';

        toast({
          variant: "destructive",
          title: `Error de inicio de sesión con ${provider}`,
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

  // Update user profile
  const updateProfile = async (userId: string, updates: any): Promise<{ error: AuthError | null; data: any | null }> => {
    if (!userId) {
      return { 
        error: { 
          type: 'session', 
          message: "No hay sesión activa" 
        },
        data: null
      };
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al actualizar perfil",
          description: error.message,
        });
        
        return { 
          error: { 
            type: 'server', 
            message: "Error al actualizar perfil", 
            details: error.message 
          },
          data: null
        };
      }
      
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
          type: 'server', 
          message: "Error del servidor", 
          details: err.message 
        },
        data: null
      };
    }
  };

  return {
    fetchProfile,
    signIn,
    signUp,
    signInWithProvider,
    updateProfile
  };
};
