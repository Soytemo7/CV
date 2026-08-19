import { createContext, useEffect, useState } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  loginWithGoogle as loginWithGoogleRequest,
  getCurrentUser,
  logout as logoutRequest,
  logoutAll as logoutAllRequest
} from "../services/authService.js";


const AuthContext = createContext(null);


function AuthProvider({ children, checkOnMount = false }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(checkOnMount);


  const checkSession = async () => {

    try {

      const data = await getCurrentUser();

      setUser(data.user);

    } catch {

      setUser(null);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    if (!checkOnMount) {
      return;
    }

    const initializeAuth = async () => {

      await checkSession();

    };

    initializeAuth();

  }, [checkOnMount]);

  const login = async (email, password) => {

    const data = await loginRequest(email, password);

    const currentUser = await getCurrentUser();

    setUser(currentUser.user);

    return {
      ...data,
      user: currentUser.user
    };

  };



  const register = async (name, email, password) => {

    const data = await registerRequest(
      name,
      email,
      password
    );

    return data;

  };

  const loginWithGoogle = async (credential) => {

    const data = await loginWithGoogleRequest(
      credential
    );

    const currentUser = await getCurrentUser();

    setUser(currentUser.user);

    return {
      ...data,
      user: currentUser.user
    };

  };


  const logout = async () => {

    await logoutRequest();

    setUser(null);

  };

  const logoutAll = async () => {

    await logoutAllRequest();

    setUser(null);

  };


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
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}


export { AuthContext, AuthProvider };