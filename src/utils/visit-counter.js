const API_URL = import.meta.env.VITE_API_URL;

export async function registerVisit() {

  try {

    const response = await fetch(
      `${API_URL}/api/visit`,
      {
        method: "POST",
        credentials: "include",
        keepalive: true
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "No fue posible registrar la visita."
      );
    }

    return data;

  } catch (error) {

    console.error(
      "Error al registrar la visita:",
      error
    );

  }

}