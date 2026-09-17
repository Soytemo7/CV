import api from "../api.js";


// ============================================================
// USER — CONSTANCIAS ACADÉMICAS
// ============================================================

export const getAcademicCertificates =
  async () => {

    return await api(
      "/api/academic/certificates",
      {
        method: "GET"
      }
    );

  };


// ============================================================
// CONSTANCIA DE UN CURSO
// ============================================================

export const getAcademicCourseCertificate =
  async (
    courseId
  ) => {

    if (!courseId) {

      throw new Error(
        "El identificador del curso es obligatorio."
      );

    }

    return await api(
      `/api/academic/certificates/${courseId}`,
      {
        method: "GET"
      }
    );

  };


// ============================================================
// ELEGIBILIDAD
// ============================================================

export const checkAcademicCertificateEligibility =
  async (
    courseId
  ) => {

    if (!courseId) {

      throw new Error(
        "El identificador del curso es obligatorio."
      );

    }

    return await api(
      `/api/academic/certificates/${courseId}/eligibility`,
      {
        method: "GET"
      }
    );

  };


// ============================================================
// EMITIR CONSTANCIA
// ============================================================

export const issueAcademicCourseCertificate =
  async (
    courseId
  ) => {

    if (!courseId) {

      throw new Error(
        "El identificador del curso es obligatorio."
      );

    }

    return await api(
      `/api/academic/certificates/${courseId}`,
      {
        method: "POST"
      }
    );

  };


// ============================================================
// DESCARGAR PDF
// ============================================================
//
// `api()` está diseñado para respuestas JSON.
// El PDF necesita recibirse como Blob.
//
// La sesión se envía mediante la cookie existente.
// No utilizamos localStorage ni Authorization Bearer.
//
// ============================================================

export const downloadAcademicCourseCertificate =
  async (
    courseId
  ) => {

    if (!courseId) {

      throw new Error(
        "El identificador del curso es obligatorio."
      );

    }

    const API_URL =
      import.meta.env.VITE_API_URL;

    const response =
      await fetch(
        `${API_URL}/api/academic/certificates/${courseId}/pdf`,
        {
          method: "GET",
          credentials: "include"
        }
      );

    if (!response.ok) {

      let message =
        "No fue posible descargar la constancia.";

      try {

        const data =
          await response.json();

        message =
          data?.error ||
          message;

      } catch {
        // La respuesta no era JSON.
      }

      throw new Error(
        message
      );

    }

    return await response.blob();

  };


// ============================================================
// VERIFICACIÓN PÚBLICA
// ============================================================

export const verifyAcademicCertificate =
  async (
    certificateNumber
  ) => {

    if (!certificateNumber) {

      throw new Error(
        "El número de constancia es obligatorio."
      );

    }

    return await api(
      `/api/academic/certificates/verify/${encodeURIComponent(
        certificateNumber
      )}`,
      {
        method: "GET"
      }
    );

  };