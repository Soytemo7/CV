/* ============================================================
   COURSE SERVICE
   Administración de cursos académicos.
   ============================================================ */

import api from "../api.js";


// ============================================================
// ADMIN — CURSOS
// ============================================================

// ------------------------------------------------------------
// Obtener todos los cursos
// ------------------------------------------------------------

export const getAdminCourses =
  async () => {

    return await api(
      "/api/academic/courses/admin/all",
      {
        method: "GET"
      }
    );

  };


// ------------------------------------------------------------
// Crear curso
// ------------------------------------------------------------

export const createCourse =
  async (
    courseData
  ) => {

    return await api(
      "/api/academic/courses/admin",
      {
        method: "POST",
        body: JSON.stringify(
          courseData
        )
      }
    );

  };


// ------------------------------------------------------------
// Actualizar curso
// ------------------------------------------------------------

export const updateCourse =
  async (
    courseId,
    courseData
  ) => {

    return await api(
      `/api/academic/courses/admin/${encodeURIComponent(
        courseId
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify(
          courseData
        )
      }
    );

  };


// ------------------------------------------------------------
// Cambiar estado del curso
// ------------------------------------------------------------

export const updateCourseStatus =
  async (
    courseId,
    status
  ) => {

    return await api(
      `/api/academic/courses/admin/${encodeURIComponent(
        courseId
      )}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status
        })
      }

    );

  };


// ------------------------------------------------------------
// Eliminar curso
// ------------------------------------------------------------

export const deleteCourse =
  async (
    courseId
  ) => {

    return await api(
      `/api/academic/courses/admin/${encodeURIComponent(
        courseId
      )}`,
      {
        method: "DELETE"
      }
    );

  };


// ============================================================
// CATÁLOGO — CURSOS PUBLICADOS
// ============================================================

// ------------------------------------------------------------
// Obtener cursos publicados
// ------------------------------------------------------------

export const getPublishedCourses =
  async () => {

    return await api(
      "/api/academic/courses",
      {
        method: "GET"
      }
    );

  };