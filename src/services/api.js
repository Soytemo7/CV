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
    throw new Error(
      data.error || "Ocurrió un error en la solicitud."
    );
  }

  return data;
};

export default api;