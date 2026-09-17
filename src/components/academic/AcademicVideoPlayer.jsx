import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import YouTube from "react-youtube";

import {
  getVideoProgress,
  saveVideoProgress,
} from "../../services/academic/videoProgressService";

import {
  completeAcademicVideo
} from "../../services/user/academicVideoProgressService.js";

import NotificationContext from "../../context/NotificationContext";

import {
  AuthContext
} from "../../context/AuthContext.jsx";

import "../../styles/academic/academic-video.css";




const COMPLETION_THRESHOLD = 0.90;
const SEEK_TOLERANCE = 1.5;
const AUTOSAVE_INTERVAL = 5000;
const STARTUP_GRACE_MS = 2000;
const ACADEMIC_PLAYBACK_RATE = 1;




const AcademicVideoPlayer = ({
  videoId,
  youtubeId,
  courseId,
  moduleId,
  lessonId,
  title = "Video",
  description = "",
}) => {

  /*
   * ==========================================================
   * AUTENTICACIÓN
   * ==========================================================
   */

  const {
    user
  } = useContext(
    AuthContext
  );


  /*
   * ==========================================================
   * NOTIFICACIONES
   * ==========================================================
   */

  const notification =
    useContext(
      NotificationContext
    );


  /*
   * ==========================================================
   * REFERENCIAS
   * ==========================================================
   */

  const playerRef =
    useRef(null);

  const initializedRef =
    useRef(false);

  const startupUntilRef =
    useRef(0);

  const positionRef =
    useRef(0);

  const maxWatchedRef =
    useRef(0);

  const durationRef =
    useRef(0);

  const completedRef =
    useRef(false);

  const lastSavedPositionRef =
    useRef(0);

  /*
   * Evita mandar más de un PATCH al backend
   * para el mismo video.
   */

  const backendCompletionSentRef =
    useRef(false);

  const progressKeyRef =
    useRef({
      uid:
        user?.uid,

      courseId,

      moduleId,

      lessonId,

      videoId,
    });

  const savedProgressRef =
    useRef(null);


  /*
   * ==========================================================
   * IDENTIDAD DEL VIDEO ACTUAL
   * ==========================================================
   */

  useEffect(() => {

    progressKeyRef.current = {

      uid:
        user?.uid,

      courseId,

      moduleId,

      lessonId,

      videoId,

    };

  }, [
    user?.uid,
    courseId,
    moduleId,
    lessonId,
    videoId,
  ]);


  /*
   * Cada vez que cambia el video,
   * el PATCH de finalización vuelve a estar disponible
   * para ese nuevo video.
   */

  useEffect(() => {

    backendCompletionSentRef.current =
      false;

    initializedRef.current =
      false;

    positionRef.current =
      0;

    maxWatchedRef.current =
      0;

    durationRef.current =
      0;

    completedRef.current =
      false;

    lastSavedPositionRef.current =
      0;

    savedProgressRef.current =
      null;

  }, [
    videoId
  ]);


  /*
   * ==========================================================
   * ESTADO
   * ==========================================================
   */

  const [playerReady, setPlayerReady] =
    useState(false);

  const [playing, setPlaying] =
    useState(false);

  const [position, setPosition] =
    useState(0);

  const [maxWatched, setMaxWatched] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [completed, setCompleted] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  /*
   * ==========================================================
   * CARGAR PROGRESO LOCAL DEL VIDEO ACTUAL
   * ==========================================================
   */

  useEffect(() => {

    if (!user?.uid) {

      savedProgressRef.current =
        null;

      return;

    }


    savedProgressRef.current =
      getVideoProgress(
        {
          uid:
            user.uid,

          courseId,

          moduleId,

          lessonId,

          videoId,
        }
      );

  }, [
    user?.uid,
    courseId,
    moduleId,
    lessonId,
    videoId,
  ]);


  /*
   * ==========================================================
   * FORMATO DE TIEMPO
   * ==========================================================
   */

  const formatTime =
    useCallback(
      (seconds) => {

        const value =
          Math.max(
            0,
            Math.floor(
              Number(seconds) || 0
            )
          );

        const minutes =
          Math.floor(
            value / 60
          );

        const remaining =
          value % 60;

        return (
          `${String(minutes).padStart(2, "0")}:` +
          `${String(remaining).padStart(2, "0")}`
        );

      },
      []
    );


  /*
   * ==========================================================
   * VELOCIDAD ACADÉMICA FIJA
   * ==========================================================
   */

  const enforceAcademicPlaybackRate =
    useCallback(
      (player = playerRef.current) => {

        if (!player) {

          return;

        }


        try {

          const currentRate =
            Number(
              player.getPlaybackRate()
            );


          if (
            currentRate !==
            ACADEMIC_PLAYBACK_RATE
          ) {

            player.setPlaybackRate(
              ACADEMIC_PLAYBACK_RATE
            );

          }

        } catch {
          // YouTube puede no tener disponible todavía
          // el control de velocidad.
        }

      },
      []
    );


  /*
   * ==========================================================
   * GUARDAR PROGRESO LOCAL
   * ==========================================================
   *
   * IMPORTANTE:
   *
   * Esta función solamente guarda en localStorage.
   *
   * NO comunica el avance al backend.
   *
   * El backend solamente será notificado
   * cuando el video alcance el 90%.
   * ==========================================================
   */

  const persistProgress =
    useCallback(
      (force = false) => {

        if (
          !initializedRef.current
        ) {

          return null;

        }


        if (
          !user?.uid
        ) {

          return null;

        }


        const currentMax =
          Math.max(
            0,
            Number(
              maxWatchedRef.current
            ) || 0
          );


        const currentPosition =
          currentMax;


        const isCompleted =
          completedRef.current === true;


        if (
          !force &&
          !isCompleted &&
          Math.abs(
            currentPosition -
            lastSavedPositionRef.current
          ) < 1
        ) {

          return null;

        }


        setSaving(
          true
        );


        const result =
          saveVideoProgress(
            progressKeyRef.current,
            {
              position:
                currentPosition,

              maxWatched:
                currentMax,

              completed:
                isCompleted,
            }
          );


        if (result) {

          lastSavedPositionRef.current =
            Math.max(
              0,
              Number(
                result.position
              ) || currentMax
            );

        }


        setSaving(
          false
        );


        return result;

      },
      [
        user?.uid,
      ]
    );


  /*
   * ==========================================================
   * AVISAR AL BACKEND QUE EL VIDEO ESTÁ COMPLETADO
   * ==========================================================
   *
   * ESTA ES LA ÚNICA FUNCIÓN QUE ENVÍA EL PATCH.
   *
   * Se ejecuta únicamente cuando el reproductor
   * alcanza el 90%.
   * ==========================================================
   */

  const notifyBackendCompletion =
    useCallback(
      async () => {

        if (
          backendCompletionSentRef.current
        ) {

          return;

        }


        if (
          !videoId
        ) {

          console.error(
            "No se puede registrar la finalización: falta videoId."
          );

          return;

        }


        const currentPosition =
          Math.max(
            0,
            Number(
              positionRef.current
            ) || 0
          );


        const currentMaxWatched =
          Math.max(
            0,
            Number(
              maxWatchedRef.current
            ) || currentPosition
          );


        try {

          await completeAcademicVideo(
            videoId,
            {
              position:
                currentPosition,

              maxWatched:
                currentMaxWatched,
            }
          );


          backendCompletionSentRef.current =
            true;


          console.log(
            "Video académico completado correctamente en el backend:",
            videoId
          );

        } catch (requestError) {

          console.error(
            "Error registrando la finalización del video en el backend:",
            requestError
          );


          if (
            notification
          ) {

            notification.error({

              title:
                "No fue posible registrar la finalización",

              description:
                "El avance quedó guardado localmente, pero no fue posible actualizar el servidor.",

              placement:
                "topRight",

            });

          }

        }

      },
      [
        videoId,
        notification,
      ]
    );


  /*
   * ==========================================================
   * READY DE YOUTUBE
   * ==========================================================
   */

  const handlePlayerReady =
    useCallback(
      (event) => {

        const player =
          event.target;


        playerRef.current =
          player;


        enforceAcademicPlaybackRate(
          player
        );


        let videoDuration = 0;


        try {

          videoDuration =
            Number(
              player.getDuration()
            ) || 0;

        } catch {

          videoDuration = 0;

        }


        durationRef.current =
          videoDuration;


        setDuration(
          videoDuration
        );


        /*
         * Obtener progreso local.
         */

        const saved =
          getVideoProgress(
            progressKeyRef.current
          );


        savedProgressRef.current =
          saved;


        let savedPosition = 0;

        let savedMaxWatched = 0;

        let savedCompleted = false;


        if (saved) {

          savedPosition =
            Math.max(
              0,
              Number(
                saved.position
              ) || 0
            );


          savedMaxWatched =
            Math.max(
              0,
              Number(
                saved.maxWatched
              ) || 0
            );


          savedPosition =
            Math.max(
              savedPosition,
              savedMaxWatched
            );


          savedMaxWatched =
            Math.max(
              savedMaxWatched,
              savedPosition
            );


          savedCompleted =
            saved.completed === true;

        }


        /*
         * Reinicializar referencias.
         */

        positionRef.current =
          savedPosition;


        maxWatchedRef.current =
          savedMaxWatched;


        completedRef.current =
          savedCompleted;


        lastSavedPositionRef.current =
          savedMaxWatched;


        /*
         * Si localStorage ya dice que está completado,
         * no volvemos a mandar PATCH.
         *
         * El backend ya debería haber sido informado
         * cuando se completó originalmente.
         */

        if (
          savedCompleted
        ) {

          backendCompletionSentRef.current =
            true;

        }


        setPosition(
          savedPosition
        );


        setMaxWatched(
          savedMaxWatched
        );


        setCompleted(
          savedCompleted
        );


        /*
         * Restaurar posición.
         */

        if (
          savedMaxWatched > 0
        ) {

          try {

            player.seekTo(
              savedMaxWatched,
              true
            );

          } catch {
            // YouTube todavía puede estar inicializando.
          }

        }


        startupUntilRef.current =
          Date.now() +
          STARTUP_GRACE_MS;


        /*
         * El video comienza pausado.
         */

        try {

          player.pauseVideo();

        } catch {
          // Ignorar.
        }


        enforceAcademicPlaybackRate(
          player
        );


        initializedRef.current =
          true;


        setPlayerReady(
          true
        );


        setPlaying(
          false
        );

      },
      [
        enforceAcademicPlaybackRate,
      ]
    );


  /*
   * ==========================================================
   * CAMBIO DE VELOCIDAD
   * ==========================================================
   */

  const handlePlaybackRateChange =
    useCallback(
      (event) => {

        enforceAcademicPlaybackRate(
          event.target
        );

      },
      [
        enforceAcademicPlaybackRate,
      ]
    );


  /*
   * ==========================================================
   * CAMBIO DE ESTADO YOUTUBE
   * ==========================================================
   */

  const handlePlayerStateChange =
    useCallback(
      (event) => {

        const player =
          event.target;


        const YT =
          window.YT;


        if (!YT) {

          return;

        }


        /*
         * PLAYING
         */

        if (
          event.data ===
          YT.PlayerState.PLAYING
        ) {

          enforceAcademicPlaybackRate(
            player
          );


          setPlaying(
            true
          );


          return;

        }


        /*
         * PAUSED
         */

        if (
          event.data ===
          YT.PlayerState.PAUSED
        ) {

          setPlaying(
            false
          );


          try {

            const current =
              Number(
                player.getCurrentTime()
              ) || 0;


            positionRef.current =
              current;


            setPosition(
              current
            );

          } catch {
            // Ignorar.
          }


          /*
           * Solamente localStorage.
           *
           * NO PATCH.
           */

          persistProgress(
            true
          );


          return;

        }


        /*
         * ENDED
         */

        if (
          event.data ===
          YT.PlayerState.ENDED
        ) {

          setPlaying(
            false
          );


          const videoDuration =
            durationRef.current;


          if (
            videoDuration > 0
          ) {

            positionRef.current =
              videoDuration;


            maxWatchedRef.current =
              Math.max(
                maxWatchedRef.current,
                videoDuration
              );


            setPosition(
              videoDuration
            );


            setMaxWatched(
              maxWatchedRef.current
            );

          }


          /*
           * IMPORTANTE:
           *
           * NO marcamos completed aquí.
           *
           * La acreditación solamente ocurre
           * cuando se alcanza el 90%.
           *
           * Si el 90% ya fue detectado anteriormente,
           * completedRef ya es true y el backend
           * ya recibió su PATCH.
           */

          persistProgress(
            true
          );


          if (
            notification
          ) {

            notification.success({

              title:
                "Video finalizado",

              description:
                "Has reproducido el video completo de esta lección.",

              placement:
                "topRight",

            });

          }

        }

      },
      [
        enforceAcademicPlaybackRate,
        persistProgress,
        notification,
      ]
    );


  /*
   * ==========================================================
   * CONTROL PLAY
   * ==========================================================
   */

  const handlePlay =
    useCallback(
      () => {

        const player =
          playerRef.current;


        if (
          !player ||
          !playerReady
        ) {

          return;

        }


        try {

          enforceAcademicPlaybackRate(
            player
          );


          const currentTime =
            Number(
              player.getCurrentTime()
            ) || 0;


          const videoDuration =
            Number(
              durationRef.current
            ) || 0;


          /*
           * Si ya está completado y se encuentra
           * físicamente al final, comenzar nuevamente.
           *
           * NO se elimina la acreditación.
           */

          if (
            completedRef.current &&
            videoDuration > 0 &&
            currentTime >=
              videoDuration - 0.5
          ) {

            player.seekTo(
              0,
              true
            );


            enforceAcademicPlaybackRate(
              player
            );


            player.playVideo();


            positionRef.current =
              0;


            setPosition(
              0
            );


            setPlaying(
              true
            );


            return;

          }


          player.playVideo();

        } catch {
          // Ignorar errores de YouTube.
        }

      },
      [
        playerReady,
        enforceAcademicPlaybackRate,
      ]
    );


  /*
   * ==========================================================
   * CONTROL PAUSA
   * ==========================================================
   */

  const handlePause =
    useCallback(
      () => {

        const player =
          playerRef.current;


        if (!player) {

          return;

        }


        try {

          player.pauseVideo();

        } catch {
          // Ignorar.
        }

      },
      []
    );


  /*
   * ==========================================================
   * GUARDAR MANUALMENTE
   * ==========================================================
   */

  const handleSaveProgress =
    useCallback(
      () => {

        const result =
          persistProgress(
            true
          );


        if (
          result &&
          notification
        ) {

          notification.success({

            title:
              "Avance guardado",

            description:
              "Tu avance académico se ha guardado correctamente.",

            placement:
              "topRight",

          });

        }

      },
      [
        persistProgress,
        notification,
      ]
    );


  /*
   * ==========================================================
   * SEGUIMIENTO DEL VIDEO
   * ==========================================================
   */

  useEffect(() => {

    if (!playerReady) {

      return undefined;

    }


    const interval =
      window.setInterval(
        () => {

          const player =
            playerRef.current;


          if (
            !player ||
            !initializedRef.current
          ) {

            return;

          }


          /*
           * VELOCIDAD
           */

          enforceAcademicPlaybackRate(
            player
          );


          let currentTime = 0;

          let currentDuration =
            durationRef.current;


          try {

            currentTime =
              Number(
                player.getCurrentTime()
              ) || 0;


            if (
              currentDuration <= 0
            ) {

              currentDuration =
                Number(
                  player.getDuration()
                ) || 0;


              if (
                currentDuration > 0
              ) {

                durationRef.current =
                  currentDuration;


                setDuration(
                  currentDuration
                );

              }

            }

          } catch {

            return;

          }


          /*
           * PROTECCIÓN INICIAL
           */

          if (
            Date.now() <
            startupUntilRef.current
          ) {

            positionRef.current =
              currentTime;


            setPosition(
              currentTime
            );


            return;

          }


          /*
           * SI YA ESTÁ COMPLETADO
           *
           * Puede recorrer libremente.
           */

          if (
            completedRef.current
          ) {

            positionRef.current =
              currentTime;


            setPosition(
              currentTime
            );


            if (
              currentTime >
              maxWatchedRef.current
            ) {

              maxWatchedRef.current =
                currentTime;


              setMaxWatched(
                currentTime
              );

            }


            return;

          }


          /*
           * POSICIÓN MÁXIMA ACADÉMICAMENTE PERMITIDA
           */

          const allowedPosition =
            maxWatchedRef.current;


          /*
           * EVITAR ADELANTAR
           */

          if (
            currentTime >
            allowedPosition +
            SEEK_TOLERANCE
          ) {

            try {

              player.seekTo(
                allowedPosition,
                true
              );

            } catch {
              // Ignorar.
            }


            positionRef.current =
              allowedPosition;


            setPosition(
              allowedPosition
            );


            return;

          }


          /*
           * ACTUALIZAR POSICIÓN
           */

          positionRef.current =
            currentTime;


          setPosition(
            currentTime
          );


          /*
           * ACTUALIZAR MÁXIMO RECORRIDO
           */

          if (
            currentTime >
            maxWatchedRef.current
          ) {

            maxWatchedRef.current =
              currentTime;


            setMaxWatched(
              currentTime
            );

          }


          /*
           * ==================================================
           * COMPLETAR AL 90 %
           * ==================================================
           *
           * ESTE ES EL ÚNICO PUNTO QUE ACREDITA
           * ACADÉMICAMENTE EL VIDEO.
           */

          if (
            currentDuration > 0
          ) {

            const ratio =
              currentTime /
              currentDuration;


            if (
              ratio >=
                COMPLETION_THRESHOLD &&
              !completedRef.current
            ) {

              /*
               * Primero marcar localmente
               * como completado.
               */

              completedRef.current =
                true;


              setCompleted(
                true
              );


              /*
               * Guardar inmediatamente
               * en localStorage.
               */

              persistProgress(
                true
              );


              /*
               * =================================================
               * PATCH AL BACKEND
               * =================================================
               *
               * AQUÍ es donde se comunica oficialmente
               * la finalización.
               *
               * Solo se ejecuta una vez por video.
               */

              notifyBackendCompletion();


              /*
               * NOTIFICACIÓN DE COMPLETADO
               */

              if (
                notification
              ) {

                notification.success({

                  title:
                    "Lección completada",

                  description:
                    "Has completado el avance académico requerido para esta lección.",

                  placement:
                    "topRight",

                });

              }

            }

          }

        },
        250
      );


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, [
    playerReady,
    persistProgress,
    notification,
    enforceAcademicPlaybackRate,
    notifyBackendCompletion,
  ]);


  /*
   * ==========================================================
   * AUTOGUARDADO LOCAL
   * ==========================================================
   *
   * Sigue funcionando cada 5 segundos.
   *
   * NO manda nada al backend.
   * ==========================================================
   */

  useEffect(() => {

    if (!playing) {

      return undefined;

    }


    const interval =
      window.setInterval(
        () => {

          persistProgress(
            false
          );

        },
        AUTOSAVE_INTERVAL
      );


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, [
    playing,
    persistProgress,
  ]);


  /*
   * ==========================================================
   * GUARDAR AL SALIR
   * ==========================================================
   *
   * Solamente localStorage.
   *
   * NO PATCH.
   * ==========================================================
   */

  useEffect(() => {

    const handleBeforeUnload =
      () => {

        persistProgress(
          true
        );

      };


    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );


    return () => {

      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );


      persistProgress(
        true
      );

    };

  }, [
    persistProgress,
  ]);


  /*
   * ==========================================================
   * PORCENTAJE
   * ==========================================================
   */

  const watchedPercent =
    duration > 0
      ? Math.min(
          100,
          Math.round(
            (
              maxWatched /
              duration
            ) *
            100
          )
        )
      : 0;


  /*
   * ==========================================================
   * OPCIONES YOUTUBE
   * ==========================================================
   */

  const playerOptions = {

    width:
      "100%",

    playerVars: {

      autoplay:
        0,

      controls:
        1,

      rel:
        0,

      modestbranding:
        1,

      playsinline:
        1,

      enablejsapi:
        1,

    },

  };


  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (

    <section
      className="private-card"
    >

      <div
        className="private-card-header"
      >

        <div
          className="private-card-icon"
        >

          <i
            className="bi bi-play-circle"
          />

        </div>


        <div>

          <h2>
            {title}
          </h2>


          <p>
            {description}
          </p>

        </div>

      </div>


      <div
        className="academic-video-container"
      >

        <YouTube
          videoId={youtubeId}
          opts={playerOptions}
          onReady={handlePlayerReady}
          onStateChange={handlePlayerStateChange}
          onPlaybackRateChange={
            handlePlaybackRateChange
          }
          iframeClassName="academic-video-iframe"
        />

      </div>


      {/* ======================================================
          ESTADO DEL REPRODUCTOR
          ====================================================== */}

      <div
        className="academic-video-status-container"
      >

        <div
          className="academic-video-status-group"
        >

          <span
            className={`private-session-status ${
              playing
                ? "academic-status-playing"
                : "academic-status-paused"
            }`}
          >

            <span
              className="private-session-status-dot"
            />

            {playing
              ? "Reproduciendo"
              : "En pausa"}

          </span>


          <span
            className={`private-session-status ${
              completed
                ? "academic-status-completed"
                : "academic-status-not-completed"
            }`}
          >

            <span
              className="private-session-status-dot"
            />

            {completed
              ? "Completado"
              : "No completado"}

          </span>

        </div>


        <div
          className="academic-video-time"
        >

          <span>

            {formatTime(position)}
            {" / "}
            {formatTime(duration)}

          </span>


          <span>

            Avance académico:{" "}

            <strong>
              {formatTime(maxWatched)}
            </strong>

          </span>

        </div>

      </div>


      {/* ======================================================
          PROGRESO
          ====================================================== */}

      <div
        className="academic-video-progress"
      >

        <div
          className="academic-video-progress-labels"
        >

          <span>
            {watchedPercent}% recorrido
          </span>


          <span>
            {Math.round(
              COMPLETION_THRESHOLD * 100
            )}% de reproducción requerido para completar la lección.
          </span>

        </div>


        <div
          className="academic-video-progress-track"
        >

          <div
            className={`academic-video-progress-bar ${
              completed
                ? "academic-video-progress-completed"
                : ""
            }`}
            style={{
              width:
                `${watchedPercent}%`,
            }}
          />

        </div>

      </div>


      {/* ======================================================
          CONTROLES
          ====================================================== */}

      <div
        className="academic-video-controls"
      >

        <button
          type="button"
          className="private-password-button"
          onClick={handlePlay}
          disabled={
            !playerReady ||
            playing
          }
        >

          <i
            className="bi bi-play-fill"
          />

          <span>
            Reproducir
          </span>

        </button>


        <button
          type="button"
          className="private-password-button"
          onClick={handlePause}
          disabled={
            !playerReady ||
            !playing
          }
        >

          <i
            className="bi bi-pause-fill"
          />

          <span>
            Pausar
          </span>

        </button>


        <button
          type="button"
          className="private-password-button"
          onClick={handleSaveProgress}
          disabled={
            !playerReady ||
            saving
          }
        >

          <i
            className={
              saving
                ? "bi bi-arrow-repeat"
                : "bi bi-bookmark-check"
            }
          />

          <span>

            {saving
              ? "Guardando..."
              : "Guardar avance"}

          </span>

        </button>

      </div>


      {/* ======================================================
          INFORMACIÓN
          ====================================================== */}

      <div
        className="academic-video-information"
      >

        {completed

          ? "La lección está completada. Puedes recorrer nuevamente el video sin perder tu acreditación académica."

          : "El avance se conserva automáticamente. Al regresar, el video continuará desde el último punto guardado y permanecerá pausado."}

      </div>

    </section>

  );

};


export default AcademicVideoPlayer;