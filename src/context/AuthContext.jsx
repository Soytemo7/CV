import {
  createContext,
  useCallback,
  useEffect,
  useState
} from "react";

import {
  login as loginRequest,
  register as registerRequest,
  loginWithGoogle as loginWithGoogleRequest,
  getCurrentUser,
  logout as logoutRequest,
  logoutAll as logoutAllRequest,
  getActiveSessions as getActiveSessionsRequest,
  logoutSession as logoutSessionRequest
} from "../services/authService.js";

import {
  startAuthentication
} from "@simplewebauthn/browser";

import {
  getPasskeyAuthenticationOptions,
  verifyPasskeyAuthentication
} from "../services/api.js";

import {
  startRegistration
} from "@simplewebauthn/browser";

import {
  getPasskeyRegistrationOptions,
  verifyPasskeyRegistration,
  getUserPasskeys,
  deleteUserPasskey
} from "../services/api.js";


const AuthContext = createContext(null);


function AuthProvider({
  children,
  checkOnMount = false
}) {

  const [
    user,
    setUser
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(checkOnMount);

  // ============================================================
// OBTENER PASSKEYS
// ============================================================

const getPasskeys =
  async () => {

    try {

      const data =
        await getUserPasskeys();


      if (
        !data?.success
      ) {

        throw new Error(
          data?.error ||
          "No fue posible obtener las Passkeys."
        );

      }


      return data.passkeys || [];

    } catch (error) {

      console.error(
        "❌ Error obteniendo Passkeys:",
        error
      );

      throw error;

    }

  };


// ============================================================
// REGISTRAR PASSKEY
// ============================================================

const registerPasskey =
  async (
    name = "Passkey"
  ) => {

    try {

      // --------------------------------------------------------
      // 1. Obtener opciones
      // --------------------------------------------------------

      const data =
        await getPasskeyRegistrationOptions();


      if (
        !data?.success ||
        !data?.options
      ) {

        throw new Error(
          data?.error ||
          "No fue posible iniciar el registro de la Passkey."
        );

      }


      // --------------------------------------------------------
      // 2. Crear credencial
      // --------------------------------------------------------

      const credential =
        await startRegistration({

          optionsJSON:
            data.options

        });


      // --------------------------------------------------------
      // 3. Agregar nombre
      //
      // El backend permite:
      //
      // id
      // rawId
      // response
      // type
      // clientExtensionResults
      // authenticatorAttachment
      // name
      // --------------------------------------------------------

      const registrationResponse = {

        ...credential,

        name:
          typeof name === "string" &&
          name.trim()
            ? name.trim().slice(0, 100)
            : "Passkey"

      };


      // --------------------------------------------------------
      // 4. Verificar en backend
      // --------------------------------------------------------

      const result =
        await verifyPasskeyRegistration(
          registrationResponse
        );


      if (
        !result?.success
      ) {

        throw new Error(
          result?.error ||
          "La Passkey no pudo ser registrada."
        );

      }


      return result;

    } catch (error) {

      console.error(
        "❌ Error registrando Passkey:",
        error
      );

      throw error;

    }

  };


// ============================================================
// ELIMINAR PASSKEY
// ============================================================

const removePasskey =
  async (
    credentialID
  ) => {

    try {

      if (
        !credentialID
      ) {

        throw new Error(
          "Identificador de Passkey no válido."
        );

      }


      const result =
        await deleteUserPasskey(
          credentialID
        );


      if (
        !result?.success
      ) {

        throw new Error(
          result?.error ||
          "No fue posible eliminar la Passkey."
        );

      }


      return result;

    } catch (error) {

      console.error(
        "❌ Error eliminando Passkey:",
        error
      );

      throw error;

    }

  };

  // ============================================================
// PASSKEY LOGIN
// ============================================================

const loginWithPasskey =
  async () => {

    try {

      // --------------------------------------------------------
      // 1. Obtener challenge/options desde backend
      // --------------------------------------------------------

      const data =
        await getPasskeyAuthenticationOptions();


      if (
        !data?.success ||
        !data?.options
      ) {

        throw new Error(
          data?.error ||
          "No fue posible iniciar la autenticación con Passkey."
        );

      }


      // --------------------------------------------------------
      // 2. Abrir autenticador del dispositivo
      //
      // Windows Hello
      // Touch ID
      // Face ID
      // PIN del dispositivo
      // Security Key
      // Password Manager compatible
      // --------------------------------------------------------

      const credential =
        await startAuthentication({

          optionsJSON:
            data.options

        });


      // --------------------------------------------------------
      // 3. Enviar respuesta al backend
      // --------------------------------------------------------

      const result =
        await verifyPasskeyAuthentication(
          credential
        );


      if (
        !result?.success
      ) {

        throw new Error(
          result?.error ||
          "La Passkey no pudo ser verificada."
        );

      }


      // --------------------------------------------------------
      // 4. El backend ya creó la session cookie
      //
      // Actualizamos el usuario del frontend
      // --------------------------------------------------------

      if (
        result.user
      ) {

        setUser(
          result.user
        );

      }


      return result;

    } catch (error) {

      console.error(
        "❌ Error login Passkey:",
        error
      );

      throw error;

    }

  };


  // ============================================================
  // COMPROBAR SESIÓN
  // ============================================================

  const checkSession = useCallback(async (
    showLoading = false
  ) => {

    if (showLoading) {

      setLoading(true);

    }


    try {

      const data =
        await getCurrentUser();


      setUser(
        data.user
      );


    } catch {

      setUser(null);


    } finally {

      if (showLoading) {

        setLoading(false);

      }

    }

  }, []);


  // ============================================================
  // INICIALIZAR AUTENTICACIÓN
  // ============================================================

  useEffect(() => {

    if (!checkOnMount) {

      return;

    }


    const initializeAuth = async () => {

      await checkSession(true);

    };


    initializeAuth();

  }, [
    checkOnMount,
    checkSession
  ]);


  // ============================================================
  // COMPROBACIÓN AUTOMÁTICA DE SESIÓN
  // ============================================================

  useEffect(() => {

    if (!checkOnMount) {

      return;

    }


    const intervalId =
      setInterval(() => {

        checkSession(false);

      }, 5 * 60 * 1000);


    return () => {

      clearInterval(
        intervalId
      );

    };

  }, [
    checkOnMount,
    checkSession
  ]);


  // ============================================================
  // COMPROBAR SESIÓN AL VOLVER A LA PESTAÑA
  // ============================================================

  useEffect(() => {

    if (!checkOnMount) {

      return;

    }


    const handleVisibilityChange = () => {

      if (
        document.visibilityState === "visible"
      ) {

        checkSession(false);

      }

    };


    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );


    return () => {

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

    };

  }, [
    checkOnMount,
    checkSession
  ]);


  // ============================================================
  // LOGIN
  // ============================================================

      const login = async (
        email,
        password
      ) => {

        const data =
          await loginRequest(
            email,
            password
          );


        // ==========================================================
        // 2FA REQUERIDO
        // ==========================================================

        if (
          data?.requiresTwoFactor
        ) {

          return {

            ...data,

            requiresTwoFactor:
              true,

            challenge:
              data.challenge

          };

        }


        // ==========================================================
        // LOGIN NORMAL
        // ==========================================================

        const currentUser =
          await getCurrentUser();


        setUser(
          currentUser.user
        );


        return {

          ...data,

          user:
            currentUser.user,

          requiresTwoFactor:
            false

        };

      };


  // ============================================================
  // REGISTRO
  // ============================================================

  const register = async (
    name,
    email,
    password
  ) => {

    const data =
      await registerRequest(
        name,
        email,
        password
      );


    return data;

  };


  // ============================================================
  // LOGIN CON GOOGLE
  // ============================================================

    const loginWithGoogle = async (
      credential
    ) => {

      const data =
        await loginWithGoogleRequest(
          credential
        );


      // ==========================================================
      // 2FA REQUERIDO
      // ==========================================================

      if (
        data?.requiresTwoFactor
      ) {

        return {

          ...data,

          requiresTwoFactor:
            true,

          challenge:
            data.challenge

        };

      }


      // ==========================================================
      // LOGIN NORMAL
      // ==========================================================

      const currentUser =
        await getCurrentUser();


      setUser(
        currentUser.user
      );


      return {

        ...data,

        user:
          currentUser.user,

        requiresTwoFactor:
          false

      };

    };


  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = async () => {

    await logoutRequest();


    setUser(null);

  };


  // ============================================================
  // LOGOUT DE TODAS LAS SESIONES
  // ============================================================

  const logoutAll = async () => {

    await logoutAllRequest();


    setUser(null);

  };


  // ============================================================
  // OBTENER SESIONES ACTIVAS
  // ============================================================

  const getActiveSessions = useCallback(async () => {

    const data =
      await getActiveSessionsRequest();


    return data.sessions || [];

  }, []);


  // ============================================================
  // CERRAR UNA SESIÓN ESPECÍFICA
  // ============================================================

  const logoutSession = useCallback(async (
    sessionId
  ) => {

    const data =
      await logoutSessionRequest(
        sessionId
      );


    return data;

  }, []);


  // ============================================================
  // PROVIDER
  // ============================================================

  return (

    <AuthContext.Provider
      value={{

        user,

        loading,


        login,

        register,

        loginWithGoogle,

        loginWithPasskey,

        logout,

        logoutAll,


        getActiveSessions,

        logoutSession,


        checkSession,

        getPasskeys,

        registerPasskey,

        removePasskey

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export {
  AuthContext,
  AuthProvider
};