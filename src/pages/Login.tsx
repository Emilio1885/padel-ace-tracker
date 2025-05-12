
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSecurity, AuthError } from '@/context/SecurityContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Login = () => {
  const { signIn, signUp, user, validateEmail, validatePassword, validateName } = useSecurity();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Form validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Field validation functions
  const validateEmailField = () => {
    const result = validateEmail(email);
    setEmailError(result.valid ? '' : result.message || '');
    return result.valid;
  };

  const validatePasswordField = () => {
    const result = validatePassword(password);
    setPasswordError(result.valid ? '' : result.message || '');
    return result.valid;
  };

  const validateNameField = () => {
    const result = validateName(name);
    setNameError(result.valid ? '' : result.message || '');
    return result.valid;
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    const isEmailValid = validateEmailField();
    const isPasswordValid = validatePasswordField();
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const { error: loginError } = await signIn(email, password);
    
    if (loginError) {
      setError(loginError);
      setShowErrorDialog(true);
    }
    
    setLoading(false);
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isEmailValid = validateEmailField();
    const isPasswordValid = validatePasswordField();
    const isNameValid = validateNameField();
    
    if (!isEmailValid || !isPasswordValid || !isNameValid) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const { error: registerError } = await signUp(email, password, name);
    
    if (registerError) {
      setError(registerError);
      setShowErrorDialog(true);
    }
    
    setLoading(false);
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
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Correo electrónico</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={validateEmailField}
                      className={emailError ? "border-red-500" : ""}
                      required
                    />
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={validatePasswordField}
                      className={passwordError ? "border-red-500" : ""}
                      required
                    />
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </Button>
                </CardFooter>
              </form>
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
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre completo</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={validateNameField}
                      className={nameError ? "border-red-500" : ""}
                      required
                    />
                    {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Correo electrónico</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={validateEmailField}
                      className={emailError ? "border-red-500" : ""}
                      required
                    />
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={validatePasswordField}
                      className={passwordError ? "border-red-500" : ""}
                      required
                    />
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                  </div>
                  <div className="text-sm text-gray-500">
                    La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                  </Button>
                </CardFooter>
              </form>
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
