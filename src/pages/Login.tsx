import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSecurity } from '@/context/SecurityContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Github, Mail } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthError } from "@/types/auth";

// Define validation schemas with Zod
const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

const registerSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no debe exceder los 50 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un carácter especial"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login = () => {
  const { signIn, signUp, user, signInWithProvider } = useSecurity();
  const navigate = useNavigate();

  const [error, setError] = useState<AuthError | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [providerLoading, setProviderLoading] = useState<string | null>(null);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange", // Validate on change for real-time password strength indication
  });

  // Password validation indicators
  const password = registerForm.watch("password");
  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ''),
    lowercase: /[a-z]/.test(password || ''),
    number: /[0-9]/.test(password || ''),
    special: /[^A-Za-z0-9]/.test(password || ''),
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Login handler
  const handleLogin = async (data: LoginFormValues) => {
    setError(null);
    
    const { error: loginError } = await signIn(data.email, data.password);
    
    if (loginError) {
      setError(loginError);
      setShowErrorDialog(true);
    }
  };

  // Register handler
  const handleRegister = async (data: RegisterFormValues) => {
    setError(null);
    
    const { error: registerError } = await signUp(data.email, data.password, data.name);
    
    if (registerError) {
      setError(registerError);
      setShowErrorDialog(true);
    }
  };

  // Social login handlers
  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setProviderLoading(provider);
    setError(null);
    
    const { error: socialLoginError } = await signInWithProvider(provider);
    
    if (socialLoginError) {
      setError(socialLoginError);
      setShowErrorDialog(true);
    }
    
    setProviderLoading(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-padel-blue to-padel-green rounded-lg"></div>
          </div>
          <h1 className="text-3xl font-bold mt-4">PadelTracker</h1>
          <p className="text-gray-600">Sigue tu progreso como jugador de pádel</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar sesión</CardTitle>
                <CardDescription>
                  Ingresa tus datos para acceder a tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Social login buttons */}
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleSocialLogin('github')}
                    disabled={!!providerLoading}
                  >
                    {providerLoading === 'github' ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <Github className="h-4 w-4" />
                    )}
                    Continuar con GitHub
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleSocialLogin('google')}
                    disabled={!!providerLoading}
                  >
                    {providerLoading === 'google' ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.086-9.864L17.693 8.5H19.5v-.5h-8v1h5.93l-6.013 3.636-1.49-3.696H8.5v.5h3.929l-1.515 3.696z" fill="currentColor" />
                      </svg>
                    )}
                    Continuar con Google
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">O continúa con</span>
                  </div>
                </div>

                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="tu@ejemplo.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Contraseña</FormLabel>
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                              ¿Olvidaste tu contraseña?
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Crear cuenta</CardTitle>
                <CardDescription>
                  Completa los datos para registrarte en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Social signup buttons */}
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleSocialLogin('github')}
                    disabled={!!providerLoading}
                  >
                    {providerLoading === 'github' ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <Github className="h-4 w-4" />
                    )}
                    Continuar con GitHub
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleSocialLogin('google')}
                    disabled={!!providerLoading}
                  >
                    {providerLoading === 'google' ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.086-9.864L17.693 8.5H19.5v-.5h-8v1h5.93l-6.013 3.636-1.49-3.696H8.5v.5h3.929l-1.515 3.696z" fill="currentColor" />
                      </svg>
                    )}
                    Continuar con Google
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">O regístrate con</span>
                  </div>
                </div>

                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu nombre"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="tu@ejemplo.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          
                          {/* Password strength indicators */}
                          <div className="mt-2 space-y-2">
                            <p className="text-sm font-medium">La contraseña debe tener:</p>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-center gap-2">
                                {passwordChecks.length ? 
                                  <Check className="h-4 w-4 text-green-500" /> : 
                                  <X className="h-4 w-4 text-red-500" />}
                                Al menos 8 caracteres
                              </li>
                              <li className="flex items-center gap-2">
                                {passwordChecks.uppercase ? 
                                  <Check className="h-4 w-4 text-green-500" /> : 
                                  <X className="h-4 w-4 text-red-500" />}
                                Al menos una letra mayúscula
                              </li>
                              <li className="flex items-center gap-2">
                                {passwordChecks.lowercase ? 
                                  <Check className="h-4 w-4 text-green-500" /> : 
                                  <X className="h-4 w-4 text-red-500" />}
                                Al menos una letra minúscula
                              </li>
                              <li className="flex items-center gap-2">
                                {passwordChecks.number ? 
                                  <Check className="h-4 w-4 text-green-500" /> : 
                                  <X className="h-4 w-4 text-red-500" />}
                                Al menos un número
                              </li>
                              <li className="flex items-center gap-2">
                                {passwordChecks.special ? 
                                  <Check className="h-4 w-4 text-green-500" /> : 
                                  <X className="h-4 w-4 text-red-500" />}
                                Al menos un carácter especial
                              </li>
                            </ul>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerForm.formState.isSubmitting || !registerForm.formState.isValid}
                    >
                      {registerForm.formState.isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Error Dialog for detailed errors */}
        <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Error de {error?.type === 'password' || error?.type === 'email' ? 'autenticación' : 'sistema'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>{error?.message}</p>
              
              {error?.type === 'email' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Formato de correo incorrecto</AlertTitle>
                  <AlertDescription>
                    Asegúrate de escribir una dirección de correo válida (ejemplo@dominio.com).
                  </AlertDescription>
                </Alert>
              )}
              
              {error?.type === 'password' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Contraseña inválida</AlertTitle>
                  <AlertDescription>
                    La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial.
                  </AlertDescription>
                </Alert>
              )}
              
              {error?.details && <p className="text-sm text-gray-500">Detalles técnicos: {error.details}</p>}
              
              <Button onClick={() => setShowErrorDialog(false)} className="w-full">
                Entendido
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Login;
