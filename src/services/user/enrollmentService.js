import api from "../api.js";

/* ============================================================
   USER — INSCRIPCIONES ACADÉMICAS
   ============================================================ */

export const getMyEnrollments = async () => {
  return await api(
    "/api/academic/enrollments",
    {
      method: "GET"
    }
  );
};