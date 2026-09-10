import api from "../api.js";


/**
 * ============================================================
 * OBTENER INSCRIPCIONES ADMINISTRATIVAS
 * ============================================================
 */
export const getAdminEnrollments =
  async ({
    search = "",
    courseId = ""
  } = {}) => {

    const params =
      new URLSearchParams();


    if (
      search &&
      search.trim()
    ) {

      params.set(
        "search",
        search.trim()
      );

    }


    if (
      courseId &&
      courseId.trim()
    ) {

      params.set(
        "courseId",
        courseId.trim()
      );

    }


    const query =
      params.toString();


    return await api(
      `/api/admin/enrollments${
        query
          ? `?${query}`
          : ""
      }`,
      {
        method: "GET"
      }
    );

  };


/**
 * ============================================================
 * OBTENER DETALLE
 * ============================================================
 */
export const getAdminEnrollmentDetail =
  async (
    enrollmentId
  ) => {

    if (!enrollmentId) {

      throw new Error(
        "enrollmentId es obligatorio."
      );

    }


    return await api(
      `/api/admin/enrollments/${encodeURIComponent(
        enrollmentId
      )}`,
      {
        method: "GET"
      }
    );

  };