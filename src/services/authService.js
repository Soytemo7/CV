import api from "./api.js";

export const login = async (email, password) => {

  return await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });

};


export const register = async (name, email, password) => {

  return await api("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password
    })
  });

};


// ============================================================
// VERIFICACIÓN DE CORREO
// ============================================================

export const verifyEmail = async (oobCode) => {

  return await api("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({
      oobCode
    })
  });

};


// ============================================================
// RECUPERACIÓN DE CONTRASEÑA
// ============================================================

export const forgotPassword = async (email) => {

  return await api("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({
      email
    })
  });

};


export const resetPassword = async (oobCode, newPassword) => {

  return await api("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      oobCode,
      newPassword
    })
  });

};


// ============================================================
// GOOGLE
// ============================================================

export const loginWithGoogle = async (credential) => {

  return await api("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({
      credential
    })
  });

};


// ============================================================
// USUARIO ACTUAL
// ============================================================

export const getCurrentUser = async () => {

  return await api("/api/auth/me");

};


// ============================================================
// LOGOUT
// ============================================================

export const logout = async () => {

  return await api("/api/auth/logout", {
    method: "POST"
  });

};