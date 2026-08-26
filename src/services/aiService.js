const API_URL =
  import.meta.env.VITE_API_URL;


const REQUEST_TIMEOUT_MS =
  35_000;


export async function sendAIMessage(
  question
) {

  if (
    !question ||
    typeof question !== "string"
  ) {

    throw new Error(
      "La pregunta no es válida."
    );

  }


  const controller =
    new AbortController();


  const timeoutId =
    setTimeout(
      () => {
        controller.abort();
      },
      REQUEST_TIMEOUT_MS
    );


  try {

    const response =
      await fetch(
        `${API_URL}/api/ai/chat`,
        {

          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          credentials:
            "include",

          body:
            JSON.stringify({
              question
            }),

          signal:
            controller.signal

        }
      );


    let data;


    try {

      data =
        await response.json();

    } catch (error) {

      throw new Error(
        "El servidor devolvió una respuesta inválida.",
        {
          cause: error
        }
      );

    }


    if (!response.ok) {

      throw new Error(
        data?.error ||
        "No fue posible procesar la pregunta."
      );

    }


    if (
      !data?.success ||
      typeof data.answer !== "string"
    ) {

      throw new Error(
        "La respuesta del servidor no es válida."
      );

    }


    return data;

  } catch (error) {

    if (
      error.name ===
      "AbortError"
    ) {

      throw new Error(
        "Manuel IA tardó demasiado en responder. Inténtalo nuevamente.",
        {
          cause: error
        }
      );

    }


    if (
      error instanceof TypeError
    ) {

      throw new Error(
        "No fue posible conectarse con Manuel IA. Inténtalo nuevamente.",
        {
          cause: error
        }
      );

    }


    throw error;

  } finally {

    clearTimeout(
      timeoutId
    );

  }

}