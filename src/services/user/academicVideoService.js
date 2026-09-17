import api
  from "../api.js";


/* ============================================================
   USER — VIDEO ACADÉMICO
   ============================================================ */


/* ------------------------------------------------------------
   Obtener video académico
   ------------------------------------------------------------ */

export const getAcademicVideo =
  async (
    videoId
  ) => {

    return await api(
      `/api/academic/videos/${encodeURIComponent(videoId)}`,
      {
        method:
          "GET"
      }
    );

  };    