import api from "../api.js";


// ==========================================================
// OBTENER LECCIONES POR MÓDULO
// ==========================================================

export const getLessonsByModule = async (moduleId) => {

  if (!moduleId) {
    throw new Error("moduleId es obligatorio.");
  }

  return await api(
    `/api/academic/lessons/module/${encodeURIComponent(moduleId)}`,
    {
      method: "GET"
    }
  );

};


// ==========================================================
// OBTENER LECCIÓN POR ID
// ==========================================================

export const getLessonById = async (lessonId) => {

  if (!lessonId) {
    throw new Error("lessonId es obligatorio.");
  }

  return await api(
    `/api/academic/lessons/${encodeURIComponent(lessonId)}`,
    {
      method: "GET"
    }
  );

};


// ==========================================================
// CREAR LECCIÓN
// ==========================================================

export const createLesson = async ({
  moduleId,
  title,
  description,
  order
}) => {

  if (!moduleId) {
    throw new Error("moduleId es obligatorio.");
  }

  return await api(
    "/api/academic/lessons",
    {
      method: "POST",
      body: JSON.stringify({
        moduleId,
        title,
        description,
        order
      })
    }
  );

};


// ==========================================================
// ACTUALIZAR LECCIÓN
// ==========================================================

export const updateLesson = async (
  lessonId,
  {
    title,
    description
  }
) => {

  if (!lessonId) {
    throw new Error("lessonId es obligatorio.");
  }

  return await api(
    `/api/academic/lessons/${encodeURIComponent(lessonId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        title,
        description
      })
    }
  );

};


// ==========================================================
// ELIMINAR LECCIÓN
// ==========================================================

export const deleteLesson = async (lessonId) => {

  if (!lessonId) {
    throw new Error("lessonId es obligatorio.");
  }

  return await api(
    `/api/academic/lessons/${encodeURIComponent(lessonId)}`,
    {
      method: "DELETE"
    }
  );

};