import api from "../api.js";


/**
 * ============================================================
 * OBTENER HISTORIAL ACADÉMICO ADMINISTRATIVO
 * ============================================================
 */
export const getAdminAcademicEvents =
  async ({
    from = "",
    to = "",
    eventType = "",
    courseId = "",
    firebaseUid = "",
    student = "",
    page = 1,
    limit = 20
  } = {}) => {

    const params =
      new URLSearchParams();


    if (from) {

      params.set(
        "from",
        from
      );

    }


    if (to) {

      params.set(
        "to",
        to
      );

    }


    if (eventType) {

      params.set(
        "eventType",
        eventType
      );

    }


    if (courseId) {

      params.set(
        "courseId",
        courseId
      );

    }


    if (firebaseUid) {

      params.set(
        "firebaseUid",
        firebaseUid
      );

    }


    if (student) {

      params.set(
        "student",
        student
      );

    }


    params.set(
      "page",
      page
    );


    params.set(
      "limit",
      limit
    );


    const query =
      params.toString();


    const response =
      await api(
        `/api/admin/academic-events?${query}`,
        {
          method:
            "GET"
        }
      );


    return (
      response?.data ||
      response
    );

  };