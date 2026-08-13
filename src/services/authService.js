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

export const getCurrentUser = async () => {

  return await api("/api/auth/me");

};

export const logout = async () => {

  return await api("/api/auth/logout", {
    method: "POST"
  });

};