import api from "../api.js";


/* ============================================================
   OBTENER VIDEO DE UNA LECCIÓN
   ============================================================ */

export const getVideoByLesson = async (
  lessonId
) => {

  if (!lessonId) {
    throw new Error(
      "lessonId es obligatorio."
    );
  }


  const response =
    await api(
      `/api/academic/videos/lesson/${encodeURIComponent(lessonId)}`,
      {
        method: "GET"
      }
    );


  /*
   * El backend devuelve:
   *
   * {
   *   success: true,
   *   lesson: {...},
   *   videos: [...]
   * }
   *
   * La interfaz actual administra un video
   * por lección, por lo que tomamos el primero.
   */

  const videos =
    Array.isArray(response?.videos)
      ? response.videos
      : [];


  const video =
    videos.length > 0
      ? videos[0]
      : null;


  if (!video) {

    return {
      video: null
    };

  }


  /*
   * Normalizamos los nombres del backend
   * para mantener compatible AdminVideos.jsx.
   */

  return {
    video: {
      ...video,

      provider:
        "YOUTUBE",

      providerVideoId:
        video.youtubeId,

      durationSeconds:
        video.duration
    }
  };

};


/* ============================================================
   OBTENER VIDEO POR ID
   ============================================================ */

export const getVideoById = async (
  videoId
) => {

  if (!videoId) {
    throw new Error(
      "videoId es obligatorio."
    );
  }


  const response =
    await api(
      `/api/academic/videos/${encodeURIComponent(videoId)}`,
      {
        method: "GET"
      }
    );


  return response;

};


/* ============================================================
   CREAR VIDEO
   ============================================================ */

export const createVideo = async ({
  lessonId,
  title,
  description,
  youtubeId,
  duration,
  order
}) => {

  if (!lessonId) {
    throw new Error(
      "lessonId es obligatorio."
    );
  }


  if (
    !title ||
    !title.trim()
  ) {

    throw new Error(
      "El título del video es obligatorio."
    );

  }


  if (
    !youtubeId ||
    !youtubeId.trim()
  ) {

    throw new Error(
      "El identificador del video es obligatorio."
    );

  }


  if (
    duration === undefined ||
    duration === null ||
    duration === ""
  ) {

    throw new Error(
      "La duración del video es obligatoria."
    );

  }


  if (
    !Number.isInteger(
      Number(order)
    ) ||
    Number(order) < 1
  ) {

    throw new Error(
      "El orden del video debe ser un entero mayor o igual a 1."
    );

  }


  return await api(
    "/api/academic/videos",
    {
      method: "POST",

      body: JSON.stringify({

        lessonId,

        title:
          title.trim(),

        description:
          description !== undefined &&
          description !== null &&
          description !== ""
            ? description
            : null,

        youtubeId:
          youtubeId.trim(),

        duration:
          Number(duration),

        order:
          Number(order)

      })
    }
  );

};


/* ============================================================
   ACTUALIZAR VIDEO
   ============================================================ */

export const updateVideo = async (
  videoId,
  {
    title,
    description,
    youtubeId,
    duration,
    order
  }
) => {

  if (!videoId) {
    throw new Error(
      "videoId es obligatorio."
    );
  }


  const body = {};


  /*
   * TÍTULO
   */

  if (
    title !== undefined
  ) {

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {

      throw new Error(
        "El título del video no puede estar vacío."
      );

    }


    body.title =
      title.trim();

  }


  /*
   * DESCRIPCIÓN
   */

  if (
    description !== undefined
  ) {

    body.description =
      description !== null
        ? description
        : null;

  }


  /*
   * YOUTUBE
   */

  if (
    youtubeId !== undefined
  ) {

    if (
      typeof youtubeId !== "string" ||
      !youtubeId.trim()
    ) {

      throw new Error(
        "youtubeId no puede estar vacío."
      );

    }


    body.youtubeId =
      youtubeId.trim();

  }


  /*
   * DURACIÓN
   */

  if (
    duration !== undefined
  ) {

    if (
      duration !== null &&
      (
        typeof duration !== "number" ||
        duration < 0
      )
    ) {

      throw new Error(
        "duration debe ser un número mayor o igual a 0."
      );

    }


    body.duration =
      duration !== null
        ? Number(duration)
        : null;

  }


  /*
   * ORDEN
   */

  if (
    order !== undefined
  ) {

    if (
      !Number.isInteger(
        Number(order)
      ) ||
      Number(order) < 1
    ) {

      throw new Error(
        "El orden del video debe ser un entero mayor o igual a 1."
      );

    }


    body.order =
      Number(order);

  }


  /*
   * ACTUALIZAR
   */

  return await api(
    `/api/academic/videos/${encodeURIComponent(videoId)}`,
    {
      method: "PATCH",

      body:
        JSON.stringify(body)
    }
  );

};


/* ============================================================
   ELIMINAR VIDEO
   ============================================================ */

export const deleteVideo = async (
  videoId
) => {

  if (!videoId) {
    throw new Error(
      "videoId es obligatorio."
    );
  }


  return await api(
    `/api/academic/videos/${encodeURIComponent(videoId)}`,
    {
      method: "DELETE"
    }
  );

};