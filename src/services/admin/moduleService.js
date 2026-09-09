/* ============================================================
   MODULE SERVICE
   Administración de módulos académicos.
   ============================================================ */

import api from "../api.js";


// ============================================================
// OBTENER MÓDULOS DE UN CURSO
// ============================================================

export const getModulesByCourse =
  async (
    courseId
  ) => {

    if (!courseId) {

      throw new Error(
        "courseId es obligatorio."
      );

    }


    return await api(
      `/api/academic/modules/course/${encodeURIComponent(
        courseId
      )}`,
      {
        method: "GET"
      }
    );

  };


// ============================================================
// OBTENER MÓDULO POR ID
// ============================================================

export const getModuleById =
  async (
    moduleId
  ) => {

    if (!moduleId) {

      throw new Error(
        "moduleId es obligatorio."
      );

    }


    return await api(
      `/api/academic/modules/${encodeURIComponent(
        moduleId
      )}`,
      {
        method: "GET"
      }
    );

  };


// ============================================================
// CREAR MÓDULO
// ============================================================

export const createModule =
  async ({
    courseId,
    title,
    description,
    order
  }) => {

    return await api(
      "/api/academic/modules",
      {
        method: "POST",

        body: JSON.stringify({
          courseId,
          title,
          description,
          order
        })
      }
    );

  };


// ============================================================
// ACTUALIZAR MÓDULO
// ============================================================

export const updateModule =
  async (
    moduleId,
    {
      title,
      description,
      order
    }
  ) => {

    if (!moduleId) {

      throw new Error(
        "moduleId es obligatorio."
      );

    }


    return await api(
      `/api/academic/modules/${encodeURIComponent(
        moduleId
      )}`,
      {
        method: "PATCH",

        body: JSON.stringify({
          title,
          description,
          order
        })
      }
    );

  };


// ============================================================
// ELIMINAR MÓDULO
// ============================================================

export const deleteModule =
  async (
    moduleId
  ) => {

    if (!moduleId) {

      throw new Error(
        "moduleId es obligatorio."
      );

    }


    return await api(
      `/api/academic/modules/${encodeURIComponent(
        moduleId
      )}`,
      {
        method: "DELETE"
      }
    );

  };

