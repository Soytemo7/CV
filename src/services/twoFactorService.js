const API_URL =
  import.meta.env.VITE_API_URL;


// ============================================================
// HELPER
// ============================================================

const request = async (
  endpoint,
  options = {}
) => {

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",

          ...(options.headers || {})
        }
      }
    );


  let data = null;


  try {

    data =
      await response.json();

  } catch {

    data = null;

  }


  if (!response.ok) {

    const error =
      new Error(
        data?.error ||
        "No fue posible completar la solicitud."
      );

    error.status =
      response.status;

    error.data =
      data;

    throw error;
  }


  return data;
};


// ============================================================
// ESTADO 2FA
// ============================================================

export const getTwoFactorStatus =
  async () => {

    return await request(
      "/api/auth/2fa/status"
    );

  };


// ============================================================
// INICIAR CONFIGURACIÓN
// ============================================================

export const setupTwoFactor =
  async () => {

    return await request(
      "/api/auth/2fa/setup",
      {
        method:
          "POST"
      }
    );

  };


// ============================================================
// CONFIRMAR / ACTIVAR 2FA
// ============================================================

export const enableTwoFactor =
  async (
    token
  ) => {

    return await request(
      "/api/auth/2fa/enable",
      {
        method:
          "POST",

        body:
          JSON.stringify({
            token
          })
      }
    );

  };


// ============================================================
// COMPLETAR LOGIN CON 2FA
// ============================================================

export const verifyTwoFactorLogin =
  async ({
    challenge,
    token,
    recoveryCode
  }) => {

    const body = {
      challenge
    };


    if (
      token !== undefined
    ) {

      body.token =
        token;

    }


    if (
      recoveryCode !== undefined
    ) {

      body.recoveryCode =
        recoveryCode;

    }


    return await request(
      "/api/auth/2fa/verify-login",
      {
        method:
          "POST",

        body:
          JSON.stringify(body)
      }
    );

  };


// ============================================================
// DESACTIVAR 2FA
// ============================================================

export const disableTwoFactor =
  async ({
    token,
    recoveryCode
  }) => {

    const body = {};


    if (
      token !== undefined
    ) {

      body.token =
        token;

    }


    if (
      recoveryCode !== undefined
    ) {

      body.recoveryCode =
        recoveryCode;

    }


    return await request(
      "/api/auth/2fa/disable",
      {
        method:
          "POST",

        body:
          JSON.stringify(body)
      }
    );

  };