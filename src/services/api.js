const API_URL = import.meta.env.VITE_API_URL;

const api = async (endpoint, options = {}) => {

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {

    const error = new Error(
      data.error || "Ocurrió un error en la solicitud."
    );

    error.status = response.status;

    throw error;
  }

  return data;
};

// ============================================================
// PASSKEY
// ============================================================

// ------------------------------------------------------------
// Obtener opciones para registrar Passkey
// ------------------------------------------------------------

export const getPasskeyRegistrationOptions =
  async () => {

    return await api(
      "/api/passkeys/register/options",
      {
        method: "GET"
      }
    );

  };


// ------------------------------------------------------------
// Verificar registro Passkey
// ------------------------------------------------------------

export const verifyPasskeyRegistration =
  async (
    credential
  ) => {

    return await api(
      "/api/passkeys/register/verify",
      {
        method: "POST",
        body: JSON.stringify(
          credential
        )
      }
    );

  };


// ------------------------------------------------------------
// Obtener opciones para login Passkey
// ------------------------------------------------------------

export const getPasskeyAuthenticationOptions =
  async () => {

    return await api(
      "/api/passkeys/login/options",
      {
        method: "GET"
      }
    );

  };


// ------------------------------------------------------------
// Verificar login Passkey
// ------------------------------------------------------------

export const verifyPasskeyAuthentication =
  async (
    credential
  ) => {

    return await api(
      "/api/passkeys/login/verify",
      {
        method: "POST",
        body: JSON.stringify(
          credential
        )
      }
    );

  };


// ------------------------------------------------------------
// Obtener Passkeys del usuario
// ------------------------------------------------------------

export const getUserPasskeys =
  async () => {

    return await api(
      "/api/passkeys",
      {
        method: "GET"
      }
    );

  };


// ------------------------------------------------------------
// Eliminar Passkey
// ------------------------------------------------------------

export const deleteUserPasskey =
  async (
    credentialID
  ) => {

    return await api(
      `/api/passkeys/${encodeURIComponent(credentialID)}`,
      {
        method: "DELETE"
      }
    );

  };

  // ============================================================
// ADMIN — USUARIOS
// ============================================================

// ------------------------------------------------------------
// Obtener usuarios de la plataforma
// ------------------------------------------------------------

export const getAdminUsers =
  async () => {

    return await api(
      "/api/admin/users",
      {
        method:
          "GET"
      }
    );

  };

export const promoteAdminUser = async (uid) => {
  return await api(
    `/api/admin/users/${encodeURIComponent(uid)}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({
        role: "admin"
      })
    }
  );
};

// ------------------------------------------------------------
// Convertir administrador → usuario
// ------------------------------------------------------------

export const demoteAdminUser =
  async (
    uid
  ) => {

    return await api(
      `/api/admin/users/${encodeURIComponent(
        uid
      )}/role`,
      {
        method:
          "PATCH",

        body:
          JSON.stringify({
            role:
              "user"
          })
      }
    );

  };

export default api;