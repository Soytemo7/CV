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


export const resetPassword = async (
  oobCode,
  newPassword
) => {

  return await api("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      oobCode,
      newPassword
    })
  });

};

// ============================================================
// CAMBIO DE CONTRASEÑA
// ============================================================

export const changePassword = async (
  currentPassword,
  newPassword,
  token,
  recoveryCode
) => {

  const body = {
    currentPassword,
    newPassword
  };


  // ----------------------------------------------------------
  // TOTP
  // ----------------------------------------------------------

  if (
    token !== undefined &&
    token !== null &&
    token !== ""
  ) {

    body.token = token;

  }


  // ----------------------------------------------------------
  // CÓDIGO DE RECUPERACIÓN
  // ----------------------------------------------------------

  if (
    recoveryCode !== undefined &&
    recoveryCode !== null &&
    recoveryCode !== ""
  ) {

    body.recoveryCode =
      recoveryCode;

  }


  return await api(
    "/api/auth/change-password",
    {
      method: "POST",

      body:
        JSON.stringify(body)
    }
  );

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


// ============================================================
// LOGOUT DE TODAS LAS SESIONES
// ============================================================

export const logoutAll = async () => {

  return await api("/api/auth/logout-all", {
    method: "POST"
  });

};


// ============================================================
// SESIONES ACTIVAS
// ============================================================

export const getActiveSessions = async () => {

  return await api("/api/auth/sessions");

};


// ============================================================
// CERRAR UNA SESIÓN ESPECÍFICA
// ============================================================

export const logoutSession = async (
  sessionId
) => {

  return await api(
    `/api/auth/sessions/${sessionId}/logout`,
    {
      method: "POST"
    }
  );

};