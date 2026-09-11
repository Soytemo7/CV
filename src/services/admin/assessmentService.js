const API_URL =
  import.meta.env.VITE_API_URL;

/**
 * ============================================================
 * REQUEST
 * ============================================================
 */
const request = async (
  endpoint,
  options = {}
) => {
  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        credentials: "include",

        headers: {
          "Content-Type":
            "application/json",

          ...(options.headers || {}),
        },

        ...options,
      }
    );

  const data =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        "No fue posible completar la solicitud."
    );
  }

  return data;
};

/**
 * ============================================================
 * RESUMEN
 * ============================================================
 */
export const getAssessmentSummary =
  async (courseId) => {
    const query = courseId
      ? `?courseId=${encodeURIComponent(
          courseId
        )}`
      : "";

    return request(
      `/api/admin/assessments/summary${query}`
    );
  };

/**
 * ============================================================
 * EXÁMENES
 * ============================================================
 */
export const getAdminExams =
  async (courseId) => {
    const query = courseId
      ? `?courseId=${encodeURIComponent(
          courseId
        )}`
      : "";

    return request(
      `/api/admin/assessments/exams${query}`
    );
  };

/**
 * ============================================================
 * RESULTADOS
 * ============================================================
 */
export const getAdminAttempts =
  async ({
    courseId,
    examId,
    status = "ALL",
  } = {}) => {
    const params =
      new URLSearchParams();

    if (courseId) {
      params.set(
        "courseId",
        courseId
      );
    }

    if (examId) {
      params.set(
        "examId",
        examId
      );
    }

    params.set(
      "status",
      status
    );

    const query =
      params.toString();

    return request(
      `/api/admin/assessments/attempts${
        query
          ? `?${query}`
          : ""
      }`
    );
  };

/**
 * ============================================================
 * DETALLE
 * ============================================================
 */
export const getAdminAttemptDetail =
  async (attemptId) => {
    if (!attemptId) {
      throw new Error(
        "attemptId es obligatorio."
      );
    }

    return request(
      `/api/admin/assessments/attempts/${encodeURIComponent(
        attemptId
      )}`
    );
  };