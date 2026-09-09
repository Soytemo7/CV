/*
 * ============================================================
 * VIDEO PROGRESS SERVICE
 * ============================================================
 *
 * Persistencia LOCAL del avance académico.
 *
 * IMPORTANTE:
 * ------------------------------------------------------------
 * Este servicio NO utiliza el backend.
 *
 * El avance se guarda en localStorage para que:
 *
 * - cambiar de ruta no lo pierda
 * - cerrar la pestaña no lo pierda
 * - cerrar el navegador no lo pierda
 * - regresar posteriormente permita continuar
 *
 * La clave se construye con:
 *
 * uid + courseId + moduleId + lessonId + videoId
 *
 * Esto permite que:
 *
 * - cada usuario tenga su propio progreso
 * - cada curso tenga su propio progreso
 * - cada módulo tenga su propio progreso
 * - cada lección tenga su propio progreso
 * - cada video tenga su propio progreso
 *
 * El UID corresponde al usuario autenticado de Firebase.
 *
 * IMPORTANTE:
 * ------------------------------------------------------------
 * El UID solamente identifica el progreso LOCAL.
 *
 * La autenticación y autorización real continúan siendo
 * responsabilidad del backend mediante la sesión autenticada.
 * ============================================================
 */

const STORAGE_PREFIX =
  "academic_video_progress";


/**
 * ============================================================
 * CONSTRUCCIÓN DE CLAVE
 * ============================================================
 *
 * Identidad completa del recurso académico:
 *
 * usuario
 *   └── curso
 *        └── módulo
 *             └── lección
 *                  └── video
 *
 * Cada combinación genera una clave independiente.
 *
 * Ejemplo:
 *
 * academic_video_progress:firebaseUid:cursoId:moduloId:leccionId:videoId
 *
 * Esto evita que dos usuarios autenticados en el mismo
 * navegador compartan accidentalmente el progreso local.
 * ============================================================
 */

const buildKey = ({
  uid,
  courseId = "default-course",
  moduleId = "default-module",
  lessonId = "default-lesson",
  videoId = "default-video",
}) => {

  /*
   * El UID es obligatorio para identificar al usuario.
   *
   * No usamos un valor como "default-user", porque eso
   * provocaría que diferentes usuarios pudieran compartir
   * la misma clave de localStorage.
   */

  if (
    !uid ||
    typeof uid !== "string"
  ) {

    throw new Error(
      "uid es obligatorio para identificar el progreso del video."
    );

  }


  return [
    STORAGE_PREFIX,
    uid,
    courseId,
    moduleId,
    lessonId,
    videoId,
  ].join(":");

};


/**
 * ============================================================
 * OBTENER PROGRESO
 * ============================================================
 */

export const getVideoProgress = (
  params
) => {

  try {

    const key =
      buildKey(params);


    const raw =
      localStorage.getItem(
        key
      );


    if (!raw) {

      return null;

    }


    const data =
      JSON.parse(raw);


    if (
      !data ||
      typeof data !== "object"
    ) {

      return null;

    }


    return {

      position:
        Number(
          data.position
        ) || 0,

      maxWatched:
        Number(
          data.maxWatched
        ) || 0,

      completed:
        data.completed === true,

      updatedAt:
        Number(
          data.updatedAt
        ) || 0,

    };

  } catch (error) {

    console.error(
      "Error leyendo progreso del video:",
      error
    );

    return null;

  }

};


/**
 * ============================================================
 * GUARDAR PROGRESO
 * ============================================================
 */

export const saveVideoProgress = (
  params,
  progress
) => {

  try {

    const key =
      buildKey(params);


    const position =
      Math.max(
        0,
        Number(
          progress.position
        ) || 0
      );


    const maxWatched =
      Math.max(
        0,
        Number(
          progress.maxWatched
        ) || 0
      );


    const completed =
      progress.completed === true;


    const data = {

      position,

      maxWatched,

      completed,

      updatedAt:
        Date.now(),

    };


    localStorage.setItem(
      key,
      JSON.stringify(data)
    );


    return data;

  } catch (error) {

    console.error(
      "Error guardando progreso del video:",
      error
    );

    return null;

  }

};


/**
 * ============================================================
 * ELIMINAR PROGRESO
 * ============================================================
 *
 * Útil para pruebas.
 *
 * Solo elimina el progreso del video identificado por:
 *
 * uid + courseId + moduleId + lessonId + videoId
 * ============================================================
 */

export const clearVideoProgress = (
  params
) => {

  try {

    const key =
      buildKey(params);


    localStorage.removeItem(
      key
    );

  } catch (error) {

    console.error(
      "Error eliminando progreso:",
      error
    );

  }

};


/**
 * ============================================================
 * EXPORTAR CONSTRUCCIÓN DE CLAVE
 * ============================================================
 */

export {
  buildKey,
};

