import api from "../api.js";

/**
 * ============================================================
 * ADMIN — EXÁMENES SERVICE
 * ============================================================
 *
 * Cliente HTTP para la administración de exámenes.
 *
 * Backend:
 *
 * /api/academic/courses/admin/all
 * /api/academic/assessment/course/:courseId
 * /api/academic/assessment/exam/:examId
 *
 * Administración:
 *
 * POST   /api/academic/assessment/admin/course/:courseId
 * PATCH  /api/academic/assessment/admin/exam/:examId
 * POST   /api/academic/assessment/admin/exam/:examId/question
 * PATCH  /api/academic/assessment/admin/question/:questionId
 * PUT    /api/academic/assessment/admin/question/:questionId/options
 * DELETE /api/academic/assessment/admin/question/:questionId
 *
 * Las solicitudes pasan por api.js, que conserva
 * credentials: "include".
 * ============================================================
 */

/* ============================================================
   NORMALIZADOR
   ============================================================ */

const normalizeResponse = (
  response,
  preferredKeys = []
) => {
  if (!response) {
    return response;
  }

  for (const key of preferredKeys) {
    if (
      response[key] !==
      undefined
    ) {
      return response[key];
    }
  }

  return response;
};

/* ============================================================
   CURSOS
   ============================================================ */

export const getAdminCourses =
  async () => {
    const response =
      await api(
        "/api/academic/courses/admin/all",
        {
          method: "GET",
        }
      );

    const data =
      normalizeResponse(
        response,
        [
          "courses",
          "data",
        ]
      );

    if (Array.isArray(data)) {
      return data;
    }

    if (
      Array.isArray(
        data?.courses
      )
    ) {
      return data.courses;
    }

    return [];
  };

/* ============================================================
   OBTENER EXAMEN POR CURSO
   ============================================================ */

export const getExamByCourse =
  async (
    courseId
  ) => {
    if (!courseId) {
      throw new Error(
        "courseId es obligatorio."
      );
    }

    const response =
      await api(
        `/api/academic/assessment/course/${courseId}`,
        {
          method: "GET",
        }
      );

    /*
     * El backend devuelve:
     *
     * {
     *   success: true,
     *   exam: null
     * }
     *
     * cuando el curso todavía no tiene examen.
     */

    const exam =
      normalizeResponse(
        response,
        [
          "exam",
          "data",
        ]
      );

    return exam || null;
  };

/* ============================================================
   OBTENER EXAMEN POR ID
   ============================================================ */

export const getExamById =
  async (
    examId
  ) => {
    if (!examId) {
      throw new Error(
        "examId es obligatorio."
      );
    }

    const response =
      await api(
        `/api/academic/assessment/exam/${examId}`,
        {
          method: "GET",
        }
      );

    return normalizeResponse(
      response,
      [
        "exam",
        "data",
      ]
    );
  };

/* ============================================================
   CREAR EXAMEN
   ============================================================ */

export const createExam =
  async ({
    courseId,
    title,
    description,
  }) => {
    if (!courseId) {
      throw new Error(
        "Selecciona un curso."
      );
    }

    if (
      !title ||
      !title.trim()
    ) {
      throw new Error(
        "El título del examen es obligatorio."
      );
    }

    const response =
      await api(
        `/api/academic/assessment/admin/course/${courseId}`,
        {
          method: "POST",
          body: JSON.stringify({
            title:
              title.trim(),

            description:
              description?.trim() ||
              "",
          }),
        }
      );

    return normalizeResponse(
      response,
      [
        "exam",
        "data",
      ]
    );
  };

/* ============================================================
   ACTUALIZAR EXAMEN
   ============================================================ */

export const updateExam =
  async (
    examId,
    {
      title,
      description,
    }
  ) => {
    if (!examId) {
      throw new Error(
        "examId es obligatorio."
      );
    }

    const response =
      await api(
        `/api/academic/assessment/admin/exam/${examId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title:
              title?.trim(),

            description:
              description?.trim() ||
              "",
          }),
        }
      );

    return normalizeResponse(
      response,
      [
        "exam",
        "data",
      ]
    );
  };

/* ============================================================
   CREAR PREGUNTA
   ============================================================ */

export const createQuestion =
  async (
    examId,
    {
      question,
      order,
      points,
      options,
    }
  ) => {
    if (!examId) {
      throw new Error(
        "examId es obligatorio."
      );
    }

    const response =
      await api(
        `/api/academic/assessment/admin/exam/${examId}/question`,
        {
          method: "POST",
          body: JSON.stringify({
            question:
              question?.trim(),

            order:
              Number(order),

            points:
              Number(points),

            options:
              Array.isArray(
                options
              )
                ? options.map(
                    (
                      option,
                      index
                    ) => ({
                      text:
                        option.text?.trim(),

                      order:
                        Number(
                          option.order ??
                            index + 1
                        ),

                      isCorrect:
                        Boolean(
                          option.isCorrect
                        ),
                    })
                  )
                : [],
          }),
        }
      );

    return normalizeResponse(
      response,
      [
        "question",
        "data",
      ]
    );
  };

/* ============================================================
   ACTUALIZAR PREGUNTA
   ============================================================ */

export const updateQuestion =
  async (
    questionId,
    {
      question,
      order,
      points,
    }
  ) => {
    if (!questionId) {
      throw new Error(
        "questionId es obligatorio."
      );
    }

    const response =
      await api(
        `/api/academic/assessment/admin/question/${questionId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            question:
              question?.trim(),

            order:
              Number(order),

            points:
              Number(points),
          }),
        }
      );

    return normalizeResponse(
      response,
      [
        "question",
        "data",
      ]
    );
  };

/* ============================================================
   REEMPLAZAR OPCIONES
   ============================================================ */

export const replaceQuestionOptions =
  async (
    questionId,
    options
  ) => {
    if (!questionId) {
      throw new Error(
        "questionId es obligatorio."
      );
    }

    if (
      !Array.isArray(
        options
      ) ||
      options.length < 2
    ) {
      throw new Error(
        "La pregunta debe tener al menos dos opciones."
      );
    }

    const response =
      await api(
        `/api/academic/assessment/admin/question/${questionId}/options`,
        {
          method: "PUT",
          body: JSON.stringify({
            options:
              options.map(
                (
                  option,
                  index
                ) => ({
                  text:
                    option.text?.trim(),

                  order:
                    Number(
                      option.order ??
                        index + 1
                    ),

                  isCorrect:
                    Boolean(
                      option.isCorrect
                    ),
                })
              ),
          }),
        }
      );

    return normalizeResponse(
      response,
      [
        "question",
        "data",
      ]
    );
  };

/* ============================================================
   ELIMINAR PREGUNTA
   ============================================================ */

export const deleteQuestion =
  async (
    questionId
  ) => {
    if (!questionId) {
      throw new Error(
        "questionId es obligatorio."
      );
    }

    const response =
      await api(
        `/api/academic/assessment/admin/question/${questionId}`,
        {
          method: "DELETE",
        }
      );

    return normalizeResponse(
      response,
      [
        "question",
        "data",
      ]
    );
  };

  export const getAdminExamByCourse = async (courseId) => {

  if (!courseId) {
    throw new Error("courseId es obligatorio.");
  }

  const response = await api(
    `/api/academic/assessment/admin/course/${courseId}`,
    {
      method: "GET",
    }
  );

  const exam =
    normalizeResponse(
      response,
      ["exam", "data"]
    );

  return exam || null;
};

/* ============================================================
   EXPORT DEFAULT
   ============================================================ */

export default {
  getAdminCourses,
  getExamByCourse,
  getExamById,
  createExam,
  updateExam,
  createQuestion,
  updateQuestion,
  replaceQuestionOptions,
  deleteQuestion,
  getAdminExamByCourse
};