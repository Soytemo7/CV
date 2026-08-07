const API_URL = "https://cv-backend-api.onrender.com";

export async function registerVisit() {

  try {

    const response = await fetch(
      `${API_URL}/api/visit`,
      {
        method: "POST",
        keepalive: true
      }
    );


    if (!response.ok) {
      throw new Error("No fue posible registrar la visita.");
    }


  } catch (error) {

    console.error(
      "Error al registrar la visita:",
      error
    );

  }

}