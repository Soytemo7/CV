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
  // COMPROBAR SESIÓN
  // ============================================================

  const checkSession = useCallback(async () => {

    try {

      const data =
        await getCurrentUser();


      setUser(
        data.user
      );

    } catch {

      setUser(null);

    } finally {

      setLoading(false);

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

      await checkSession();

    };


    initializeAuth();

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


    const currentUser =
      await getCurrentUser();


    setUser(
      currentUser.user
    );


    return {

      ...data,

      user:
        currentUser.user

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


    const currentUser =
      await getCurrentUser();


    setUser(
      currentUser.user
    );


    return {

      ...data,

      user:
        currentUser.user

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


        logout,

        logoutAll,


        getActiveSessions,

        logoutSession,


        checkSession

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