const API_URL =
  import.meta.env.VITE_API_URL;


/* ============================================================
   RESPUESTA
   ============================================================ */

const parseResponse =
  async (
    response
  ) => {

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
          data?.message ||
          "No fue posible completar la operación."
        );


      error.status =
        response.status;


      error.data =
        data;


      throw error;

    }


    return data;

  };


/* ============================================================
   INICIAR INTENTO
   ============================================================ */

export const startAcademicAssessmentAttempt =
  async (
    examId
  ) => {

    if (!examId) {

      throw new Error(
        "No se recibió el identificador del examen."
      );

    }


    const response =
      await fetch(
        `${API_URL}/api/academic/assessment/exam/${examId}/attempt`,
        {
          method:
            "POST",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({})
        }
      );


    return parseResponse(
      response
    );

  };


/* ============================================================
   OBTENER EXAMEN
   ============================================================ */

export const getAcademicAssessmentExam =
  async (
    examId
  ) => {

    if (!examId) {

      throw new Error(
        "No se recibió el identificador del examen."
      );

    }


    const response =
      await fetch(
        `${API_URL}/api/academic/assessment/exam/${examId}`,
        {
          method:
            "GET",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );


    return parseResponse(
      response
    );

  };


/* ============================================================
   OBTENER INTENTO
   ============================================================ */

export const getAcademicAssessmentAttempt =
  async (
    attemptId
  ) => {

    if (!attemptId) {

      throw new Error(
        "No se recibió el identificador del intento."
      );

    }


    const response =
      await fetch(
        `${API_URL}/api/academic/assessment/attempt/${attemptId}`,
        {
          method:
            "GET",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );


    return parseResponse(
      response
    );

  };


/* ============================================================
   ENVIAR INTENTO
   ============================================================ */

export const submitAcademicAssessmentAttempt =
  async (
    attemptId,
    answers
  ) => {

    if (!attemptId) {

      throw new Error(
        "No se recibió el identificador del intento."
      );

    }


    if (!Array.isArray(answers)) {

      throw new Error(
        "Las respuestas no tienen un formato válido."
      );

    }


    const response =
      await fetch(
        `${API_URL}/api/academic/assessment/attempt/${attemptId}/submit`,
        {
          method:
            "POST",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              answers
            })
        }
      );


    return parseResponse(
      response
    );

  };