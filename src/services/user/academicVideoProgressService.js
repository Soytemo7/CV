import api
  from "../api.js";


/* ============================================================
   USER — PROGRESO DE VIDEO ACADÉMICO
   ============================================================ */


/* ------------------------------------------------------------
   Obtener progreso oficial del video
   ------------------------------------------------------------ */

export const getAcademicVideoProgress =
  async (
    videoId
  ) => {

    return await api(
      `/api/academic/progress/video/${encodeURIComponent(videoId)}`,
      {
        method:
          "GET"
      }
    );

  };


/* ------------------------------------------------------------
   Marcar video como completado
   ------------------------------------------------------------ */

export const completeAcademicVideo =
  async (
    videoId,
    progress
  ) => {

    return await api(
      `/api/academic/progress/video/${encodeURIComponent(videoId)}`,
      {
        method:
          "PATCH",

        body:
          JSON.stringify({

            position:
              Number(
                progress?.position || 0
              ),

            maxWatched:
              Number(
                progress?.maxWatched || 0
              ),

            completed:
              true

          })
      }
    );

  };