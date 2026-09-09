import {
  useEffect,
  useState
} from "react";

import {
  createVideo,
  updateVideo
} from "../../../services/admin/videoService.js";

import {
  useNotification
} from "../../../hooks/useNotification.js";

import "../../../styles/admin/admin-users.css";
import "../../../styles/admin/admin-courses.css";
import "../../../styles/animated-border.css";
import "../../../styles/privateIconButton.css";


const AdminVideoForm = ({
  lessonId,
  video,
  onSaved,
  onCancel
}) => {

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [youtubeId, setYoutubeId] =
    useState("");

  const [hours, setHours] =
    useState("0");

  const [minutes, setMinutes] =
    useState("0");

  const [seconds, setSeconds] =
    useState("0");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const notification =
    useNotification();


  // ==========================================================
  // CARGAR DATOS EN EDICIÓN
  // ==========================================================

  useEffect(() => {

    if (video) {

      setTitle(
        video.title || ""
      );

      setDescription(
        video.description || ""
      );

      setYoutubeId(
        video.youtubeId ||
        video.providerVideoId ||
        ""
      );


      const totalSeconds =
        Number(
          video.duration ??
          video.durationSeconds
        ) || 0;


      const calculatedHours =
        Math.floor(
          totalSeconds / 3600
        );


      const calculatedMinutes =
        Math.floor(
          (totalSeconds % 3600) / 60
        );


      const calculatedSeconds =
        totalSeconds % 60;


      setHours(
        String(calculatedHours)
      );

      setMinutes(
        String(calculatedMinutes)
      );

      setSeconds(
        String(calculatedSeconds)
      );

    } else {

      setTitle("");

      setDescription("");

      setYoutubeId("");

      setHours("0");
      setMinutes("0");
      setSeconds("0");

    }

    setError("");

  }, [video]);


  // ==========================================================
  // EXTRAER ID DE YOUTUBE
  // ==========================================================

  const extractYouTubeId = (value) => {

    const input =
      value.trim();


    if (!input) {
      return "";
    }


    /*
     * ID DIRECTO
     */

    if (
      /^[a-zA-Z0-9_-]{11}$/.test(
        input
      )
    ) {

      return input;

    }


    /*
     * URL DE YOUTUBE
     */

    try {

      const url =
        new URL(input);


      /*
       * URL CORTA
       *
       * https://youtu.be/XXXXXXXXXXX
       */

      if (
        url.hostname === "youtu.be" ||
        url.hostname === "www.youtu.be"
      ) {

        const id =
          url.pathname
            .split("/")
            .filter(Boolean)[0];


        if (
          id &&
          /^[a-zA-Z0-9_-]{11}$/.test(id)
        ) {

          return id;

        }

      }


      /*
       * YOUTUBE.COM
       */

      if (
        url.hostname === "youtube.com" ||
        url.hostname === "www.youtube.com" ||
        url.hostname === "m.youtube.com"
      ) {

        /*
         * URL NORMAL
         *
         * https://www.youtube.com/watch?v=XXXXXXXXXXX
         */

        const parameter =
          url.searchParams.get("v");


        if (
          parameter &&
          /^[a-zA-Z0-9_-]{11}$/.test(
            parameter
          )
        ) {

          return parameter;

        }


        /*
         * EMBED
         *
         * https://www.youtube.com/embed/XXXXXXXXXXX
         */

        const parts =
          url.pathname
            .split("/")
            .filter(Boolean);


        const embedIndex =
          parts.indexOf("embed");


        if (
          embedIndex !== -1 &&
          parts[embedIndex + 1]
        ) {

          const id =
            parts[embedIndex + 1];


          if (
            /^[a-zA-Z0-9_-]{11}$/.test(id)
          ) {

            return id;

          }

        }


        /*
         * SHORTS
         *
         * https://www.youtube.com/shorts/XXXXXXXXXXX
         */

        const shortsIndex =
          parts.indexOf("shorts");


        if (
          shortsIndex !== -1 &&
          parts[shortsIndex + 1]
        ) {

          const id =
            parts[shortsIndex + 1];


          if (
            /^[a-zA-Z0-9_-]{11}$/.test(id)
          ) {

            return id;

          }

        }

      }

    } catch {
      return "";
    }


    return "";

  };


  // ==========================================================
  // GUARDAR
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    setError("");


    // ========================================================
    // VALIDAR TÍTULO
    // ========================================================

    if (!title.trim()) {

      setError(
        "El título del video es obligatorio."
      );

      return;

    }


    // ========================================================
    // EXTRAER ID DE YOUTUBE
    // ========================================================

    const extractedId =
      extractYouTubeId(
        youtubeId
      );


    if (!extractedId) {

      setError(
        "Ingresa una URL válida de YouTube o su identificador de 11 caracteres."
      );

      return;

    }


    // ========================================================
    // CONVERTIR VALORES DE DURACIÓN
    // ========================================================

    const hoursValue =
      Number(hours);


    const minutesValue =
      Number(minutes);


    const secondsValue =
      Number(seconds);


    // ========================================================
    // VALIDAR HORAS
    // ========================================================

    if (
      !Number.isInteger(hoursValue) ||
      hoursValue < 0
    ) {

      setError(
        "Las horas deben ser un número entero mayor o igual a cero."
      );

      return;

    }


    // ========================================================
    // VALIDAR MINUTOS
    // ========================================================

    if (
      !Number.isInteger(minutesValue) ||
      minutesValue < 0 ||
      minutesValue > 59
    ) {

      setError(
        "Los minutos deben estar entre 0 y 59."
      );

      return;

    }


    // ========================================================
    // VALIDAR SEGUNDOS
    // ========================================================

    if (
      !Number.isInteger(secondsValue) ||
      secondsValue < 0 ||
      secondsValue > 59
    ) {

      setError(
        "Los segundos deben estar entre 0 y 59."
      );

      return;

    }


    // ========================================================
    // CONVERTIR A SEGUNDOS TOTALES
    // ========================================================

    const duration =
      (
        hoursValue * 3600
      ) +
      (
        minutesValue * 60
      ) +
      secondsValue;


    if (
      duration <= 0
    ) {

      setError(
        "La duración del video debe ser mayor que cero."
      );

      return;

    }


    // ========================================================
    // GUARDAR
    // ========================================================

    setLoading(true);


    try {

      if (video) {

        await updateVideo(
          video.id,
          {
            title:
              title.trim(),

            description:
              description.trim() || null,

            youtubeId:
              extractedId,

            duration:
              duration,

            order:
              Number(video.order) || 1
          }
        );


        notification.success({
          title: "¡Video actualizado!",
          description:
            "La información del video se actualizó correctamente.",
          placement: "topRight",
          duration: 8,
          showProgress: true,
          pauseOnHover: true,
          closable: true,
          className: "welcome-notification",
        });

      } else {

        await createVideo({
          lessonId,

          title:
            title.trim(),

          description:
            description.trim() || null,

          youtubeId:
            extractedId,

          duration:
            duration,

          order:
            1
        });


        notification.success({
          title: "¡Video creado!",
          description:
            "El video se creó correctamente.",
          placement: "topRight",
          duration: 8,
          showProgress: true,
          pauseOnHover: true,
          closable: true,
          className: "welcome-notification",
        });

      }


      await onSaved();

    } catch (err) {

      setError(
        err.message ||
        "No se pudo guardar el video."
      );


      notification.error({
        title: video
          ? "Error al actualizar el video"
          : "Error al crear el video",
        description:
          err.message ||
          "No fue posible guardar el video.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="admin-promotion-modal-overlay">

      <div
        className="
          admin-promotion-modal
          animated-border
          admin-courses-delete-modal
        "
      >

        {/* ==================================================
            ICONO
            ================================================== */}

        <div
          className={`
            admin-promotion-modal-icon
            private-icon-button
            ${
              video
                ? "private-icon-button-purple"
                : "private-icon-button-blue"
            }
          `}
          aria-hidden="true"
        >

          <i
            className={
              video
                ? "bi bi-pencil-square"
                : "bi bi-play-circle"
            }
          ></i>

        </div>


        {/* ==================================================
            CONTENIDO
            ================================================== */}

        <div className="admin-promotion-modal-content">

          <h2>
            {video
              ? "Editar video"
              : "Nuevo video"}
          </h2>


          <p>
            {video
              ? "Actualiza la información del video de la lección."
              : "Agrega un video de YouTube a esta lección."}
          </p>


          {/* ==================================================
              ERROR
              ================================================== */}

          {error && (
            <div
              className="admin-users-error"
              role="alert"
            >

              <i className="bi bi-exclamation-triangle"></i>

              {error}

            </div>
          )}


          <form
            onSubmit={handleSubmit}
          >

            {/* ================================================
                TÍTULO
                ================================================ */}

            <div className="admin-users-form-group">

              <label htmlFor="video-title">
                Título del video
              </label>

              <input
                id="video-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                maxLength={200}
                placeholder="Ej. Introducción al tema"
                disabled={loading}
                autoFocus
              />

            </div>


            {/* ================================================
                DESCRIPCIÓN
                ================================================ */}

            <div className="admin-users-form-group">

              <label htmlFor="video-description">
                Descripción
              </label>

              <textarea
                id="video-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Descripción opcional del video."
                disabled={loading}
              />

            </div>


            {/* ================================================
                PROVEEDOR
                ================================================ */}

            <div className="admin-users-form-group">

              <label htmlFor="video-provider">
                Proveedor
              </label>

              <input
                id="video-provider"
                type="text"
                value="YouTube"
                disabled
              />

            </div>


            {/* ================================================
                URL DEL VIDEO
                ================================================ */}

            <div className="admin-users-form-group">

              <label htmlFor="video-youtube-id">
                URL del video de YouTube
              </label>

              <input
                id="video-youtube-id"
                type="text"
                value={youtubeId}
                onChange={(event) =>
                  setYoutubeId(
                    event.target.value
                  )
                }
                placeholder="https://youtu.be/XXXXXXXXXXX"
                disabled={loading}
              />

            </div>


            {/* ================================================
                DURACIÓN
                ================================================ */}

            <div className="admin-users-form-group">

              <label>
                Duración del video
              </label>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, 1fr)",
                  gap: "10px"
                }}
              >

                {/* HORAS */}

                <div>

                  <label
                    htmlFor="video-hours"
                    style={{
                      fontSize: "12px",
                      marginBottom: "5px",
                      display: "block"
                    }}
                  >
                    Horas
                  </label>

                  <input
                    id="video-hours"
                    type="number"
                    min="0"
                    step="1"
                    value={hours}
                    onChange={(event) =>
                      setHours(
                        event.target.value
                      )
                    }
                    disabled={loading}
                  />

                </div>


                {/* MINUTOS */}

                <div>

                  <label
                    htmlFor="video-minutes"
                    style={{
                      fontSize: "12px",
                      marginBottom: "5px",
                      display: "block"
                    }}
                  >
                    Minutos
                  </label>

                  <input
                    id="video-minutes"
                    type="number"
                    min="0"
                    max="59"
                    step="1"
                    value={minutes}
                    onChange={(event) =>
                      setMinutes(
                        event.target.value
                      )
                    }
                    disabled={loading}
                  />

                </div>


                {/* SEGUNDOS */}

                <div>

                  <label
                    htmlFor="video-seconds"
                    style={{
                      fontSize: "12px",
                      marginBottom: "5px",
                      display: "block"
                    }}
                  >
                    Segundos
                  </label>

                  <input
                    id="video-seconds"
                    type="number"
                    min="0"
                    max="59"
                    step="1"
                    value={seconds}
                    onChange={(event) =>
                      setSeconds(
                        event.target.value
                      )
                    }
                    disabled={loading}
                  />

                </div>

              </div>

            </div>


            {/* ================================================
                ORDEN
                ================================================ */}

            <div className="admin-users-form-group">

              <label htmlFor="video-order">
                Orden
              </label>

              <input
                id="video-order"
                type="number"
                value={
                  video?.order ?? 1
                }
                disabled
              />

            </div>


            {/* ================================================
                ACCIONES
                ================================================ */}

            <div className="admin-courses-modal-actions">

              <button
                type="button"
                className="admin-promotion-cancel-button"
                onClick={onCancel}
                disabled={loading}
              >

                <i className="bi bi-x-lg"></i>

                Cancelar

              </button>


              <button
                type="submit"
                className="admin-promotion-confirm-button"
                disabled={loading}
              >

                <i
                  className={
                    loading
                      ? "bi bi-hourglass-split"
                      : "bi bi-check-lg"
                  }
                ></i>

                {loading
                  ? "Guardando..."
                  : video
                    ? "Guardar cambios"
                    : "Agregar video"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );

};


export default AdminVideoForm;
