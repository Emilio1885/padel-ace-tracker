
// Email validation
export const validateEmail = (email: string) => {
  if (!email) {
    return { valid: false, message: "El correo electrónico es obligatorio" };
  }
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "El correo electrónico no es válido" };
  }
  return { valid: true };
};

// Password validation following best practices
export const validatePassword = (password: string) => {
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

// Name validation
export const validateName = (name: string) => {
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
