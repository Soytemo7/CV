import { createContext, useEffect, useState } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  getCurrentUser,
  logout as logoutRequest
} from "../services/authService.js";


const AuthContext = createContext(null);

function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const initializeAuth = async () => {

      try {

        const data = await getCurrentUser();

        setUser(data.user);

      } catch {

        setUser(null);

      } finally {

        setLoading(false);

      }

    };

    initializeAuth();

  }, []);
  

  const login = async (email, password) => {

    const data = await loginRequest(email, password);

    setUser(data.user);

    return data;

  };

  const register = async (name, email, password) => {

    const data = await registerRequest(
      name,
      email,
      password
    );

    return data;

  };

  const logout = async () => {

    await logoutRequest();

    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export { AuthContext, AuthProvider };