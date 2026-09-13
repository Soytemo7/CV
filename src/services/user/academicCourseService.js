import api from "../api.js";


/* ============================================================
   USER — CURSO ACADÉMICO
   ============================================================ */


/* ============================================================
   OBTENER CURSO COMPLETO
   ============================================================ */

export const getAcademicCourse =
  async (
    courseId
  ) => {

    if (!courseId) {

      throw new Error(
        "El identificador del curso es obligatorio."
      );

    }


    return await api(
      `/api/academic/courses/${courseId}`,
      {
        method: "GET"
      }
    );

  };


/* ============================================================
   OBTENER INSCRIPCIÓN DEL CURSO
   ============================================================ */

export const getAcademicCourseEnrollment =
  async (
    courseId
  ) => {

    if (!courseId) {

      throw new Error(
        "El identificador del curso es obligatorio."
      );

    }


    return await api(
      `/api/academic/enrollments/course/${courseId}`,
      {
        method: "GET"
      }
    );

  };


/* ============================================================
   OBTENER PROGRESO DEL CURSO
   ============================================================ */

export const getAcademicCourseProgress =
  async (
    courseId
  ) => {

    if (!courseId) {

      throw new Error(
        "El identificador del curso es obligatorio."
      );

    }


    return await api(
      `/api/academic/progress/course/${courseId}`,
      {
        method: "GET"
      }
    );

  };


/* ============================================================
   OBTENER EXAMEN DEL CURSO
   ============================================================ */

export const getAcademicCourseExam =
  async (
    courseId
  ) => {

    if (!courseId) {

      throw new Error(
        "El identificador del curso es obligatorio."
      );

    }


    return await api(
      `/api/academic/assessment/course/${courseId}`,
      {
        method: "GET"
      }
    );

  };

