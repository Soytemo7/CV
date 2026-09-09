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
   *
   * El usuario ya se encuentra dentro de una ruta privada.
   *
   * El uid corresponde al usuario autenticado mediante Firebase.
   *
   * NO se obtiene del localStorage.
   * NO se envía al backend desde este servicio.
   *
   * Solamente se utiliza para separar el progreso local
   * de cada usuario.
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
   *
   * La identidad completa ahora es:
   *
   * usuario
   *   └── curso
   *        └── módulo
   *             └── lección
   *                  └── video
   *
   * Esto evita que dos usuarios del mismo navegador
   * compartan accidentalmente el mismo progreso local.
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
   * CARGAR PROGRESO DEL VIDEO ACTUAL
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
   *
   * YouTube puede permitir que el usuario cambie la velocidad
   * desde sus controles.
   *
   * La plataforma académica siempre debe permanecer en 1×.
   *
   * Esta función solamente modifica la velocidad.
   * No modifica posición, progreso ni acreditación.
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
   * GUARDAR PROGRESO
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


        /*
         * No guardar nunca progreso sin usuario autenticado.
         */

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


        /*
         * Fijar velocidad académica inmediatamente
         * al inicializar el reproductor.
         */

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
         * Obtener el progreso correspondiente
         * EXACTAMENTE al usuario y video actual.
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
         * Reinicializar referencias del video.
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
         * Actualizar estado solamente como
         * consecuencia del evento externo onReady.
         */

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


        /*
         * Dar margen a YouTube para terminar
         * de estabilizar la posición.
         */

        startupUntilRef.current =
          Date.now() +
          STARTUP_GRACE_MS;


        /*
         * El video siempre comienza pausado.
         */

        try {

          player.pauseVideo();

        } catch {
          // Ignorar.
        }


        /*
         * Volver a asegurar 1× después de
         * la inicialización completa.
         */

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
   * CAMBIO DE VELOCIDAD YOUTUBE
   * ==========================================================
   *
   * Si el usuario intenta seleccionar 1.25×, 1.5×, 2×, etc.,
   * YouTube devuelve el reproductor inmediatamente a 1×.
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

          /*
           * Asegurar 1× cada vez que comienza
           * o vuelve a comenzar la reproducción.
           */

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


          completedRef.current =
            true;


          setCompleted(
            true
          );


          persistProgress(
            true
          );


          /*
           * NOTIFICACIÓN AL FINALIZAR REALMENTE
           * EL VIDEO.
           *
           * Este bloque es independiente de la
           * notificación del 90%.
           */

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

          /*
           * Siempre establecer 1× antes de reproducir.
           */

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
           * Si ya estaba completado y se encuentra
           * físicamente al final, comenzar nuevamente.
           *
           * NO se elimina:
           *
           * - completed
           * - maxWatched
           * - progreso académico
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
           * ==================================================
           * VELOCIDAD ACADÉMICA
           * ==================================================
           *
           * Comprobación periódica adicional.
           *
           * Si YouTube llegara a cambiar internamente
           * la velocidad, se vuelve a imponer 1×.
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
           * Protección inicial de YouTube.
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
           * Si ya está completado,
           * permitimos recorrer libremente.
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
           * Posición máxima académicamente permitida.
           */

          const allowedPosition =
            maxWatchedRef.current;


          /*
           * Evitar adelantar.
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
           * Actualizar posición actual.
           */

          positionRef.current =
            currentTime;


          setPosition(
            currentTime
          );


          /*
           * Actualizar máximo recorrido.
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
           * Determinar completado al alcanzar 90%.
           *
           * ESTE BLOQUE SE MANTIENE SIN CAMBIOS.
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

              completedRef.current =
                true;


              setCompleted(
                true
              );


              persistProgress(
                true
              );


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
  ]);


  /*
   * ==========================================================
   * AUTOGUARDADO
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
          videoId={videoId}
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
          ESTADO DEL REPRODUCTOR Y ESTADO ACADÉMICO
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
          CONTROLES PROPIOS
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