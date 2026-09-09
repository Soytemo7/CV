import {
  useEffect,
  useState
} from "react";

import {
  getVideoByLesson,
  deleteVideo
} from "../../../services/admin/videoService.js";

import {
  useNotification
} from "../../../hooks/useNotification.js";

import AdminVideoForm
  from "./AdminVideoForm.jsx";

import "../../../styles/admin/admin-users.css";
import "../../../styles/admin/admin-courses.css";
import "../../../styles/animated-border.css";
import "../../../styles/privateIconButton.css";


const AdminVideos = ({
  lessonId
}) => {

  const [video, setVideo] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [deleteModal, setDeleteModal] =
    useState(false);


  const notification =
    useNotification();


  // ==========================================================
  // CARGAR VIDEO
  // ==========================================================

  useEffect(() => {

    let cancelled = false;

    const loadVideo = async () => {

      if (!lessonId) {

        if (!cancelled) {
          setLoading(false);
        }

        return;
      }

      if (!cancelled) {
        setLoading(true);
        setError("");
      }

      try {

        const data =
          await getVideoByLesson(lessonId);

        const loadedVideo =
          data?.video ??
          data?.data?.video ??
          data?.data ??
          null;

        if (!cancelled) {
          setVideo(loadedVideo);
        }

      } catch (err) {

        if (cancelled) {
          return;
        }

        if (err.status === 404) {

          setVideo(null);
          setError("");

        } else {

          setError(
            err.message ||
            "No se pudo cargar el video."
          );

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    };

    void loadVideo();

    return () => {
      cancelled = true;
    };

  }, [lessonId]);


  // ==========================================================
  // NUEVO VIDEO
  // ==========================================================

  const handleNewVideo = () => {

    if (video) {
      return;
    }

    setShowForm(true);

  };


  // ==========================================================
  // GUARDADO
  // ==========================================================

  const handleSaved = () => {

    setShowForm(false);

    window.location.reload();

  };


  // ==========================================================
  // ELIMINAR
  // ==========================================================

  const handleDelete = () => {

    setDeleteModal(true);

  };


  const confirmDelete = async () => {

    if (!video) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {

      await deleteVideo(
        video.id
      );

      const deletedVideo =
        video;

      setDeleteModal(false);

      setVideo(null);

      notification.success({
        title: "¡Video eliminado!",
        description:
          `El video "${deletedVideo.title || "Sin título"}" se eliminó correctamente.`,
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    } catch (err) {

      setError(
        err.message ||
        "No se pudo eliminar el video."
      );

      notification.error({
        title: "Error al eliminar el video",
        description:
          err.message ||
          "No fue posible eliminar el video.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    } finally {

      setActionLoading(false);

    }

  };


  const cancelDelete = () => {

    if (actionLoading) {
      return;
    }

    setDeleteModal(false);

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="admin-courses-content-section admin-users-panel">


      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <div className="admin-courses-module-lessons">

        <div className="admin-courses-module-lessons-header">

          <span>

            <div
              className="
                private-icon-button
                private-icon-button-blue
              "
              aria-hidden="true"
            >
              <i className="bi bi-play-circle"></i>
            </div>

            Administración de videos

          </span>

        </div>


        <p className="admin-courses-no-lessons">

          Administra los videos que forman parte
          de esta lección.

        </p>

      </div>


      {/* ======================================================
          RESULTADOS
          ====================================================== */}

      <div className="admin-users-results-header">

        <span className="admin-courses-results-count">

          <i
            className="bi bi-play-circle"
            aria-hidden="true"
          ></i>

          <strong>
            {video ? 1 : 0}
          </strong>

          <span>
            {video
              ? "video"
              : "videos"}
          </span>

        </span>


        {!video && (
          <button
            type="button"
            className="admin-user-promote-button"
            onClick={handleNewVideo}
            disabled={actionLoading}
          >

            <i className="bi bi-plus-lg"></i>

            Agregar video

          </button>
        )}

      </div>


      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (
        <div
          className="admin-users-error"
          role="alert"
        >

          <i className="bi bi-exclamation-triangle"></i>

          {error}

        </div>
      )}


      {/* ======================================================
          CARGANDO / CONTENIDO
          ====================================================== */}

      {loading ? (

        <div className="admin-users-loading">

          <i className="bi bi-hourglass-split"></i>

          Cargando video...

        </div>

      ) : !video ? (

        /* ====================================================
           SIN VIDEO
           ==================================================== */

        <div
          className="
            admin-courses-empty
            animated-border
          "
        >

          <div
            className="
              admin-courses-empty-icon
              private-icon-button
              private-icon-button-blue
            "
            aria-hidden="true"
          >

            <i className="bi bi-play-circle"></i>

          </div>


          <h3>
            Esta lección todavía no tiene video
          </h3>


          <p>
            Agrega el video de YouTube que
            corresponde a esta lección.
          </p>


          <button
            type="button"
            className="admin-user-promote-button"
            onClick={handleNewVideo}
          >

            <i className="bi bi-plus-lg"></i>

            Agregar video

          </button>

        </div>

      ) : (

        /* ====================================================
           VIDEO
           ==================================================== */

        <div className="admin-courses-lessons-list">

          <article
            className="
              admin-courses-lesson-card
              animated-border
            "
          >

            <div className="admin-courses-lesson-number">

              01

            </div>


            <div className="admin-courses-lesson-content">

              <div className="admin-courses-lesson-header">

                <div>

                  <h3>
                    Video de la lección
                  </h3>


                  <p>

                    YouTube ·{" "}

                    {video.providerVideoId}

                  </p>

                </div>


                <div className="admin-courses-module-actions">

                  <button
                    type="button"
                    className="admin-users-view-button"
                    onClick={() =>
                      setShowForm(true)
                    }
                    title="Editar video"
                    aria-label="Editar video"
                  >

                    <i className="bi bi-pencil-square"></i>

                  </button>


                  <button
                    type="button"
                    className="admin-promotion-cancel-button"
                    onClick={handleDelete}
                    title="Eliminar video"
                    aria-label="Eliminar video"
                  >

                    <i className="bi bi-trash3"></i>

                  </button>

                </div>

              </div>


              <div className="admin-courses-lesson-videos">

                <span>

                  <i className="bi bi-clock"></i>

                  Duración

                </span>


                <span className="admin-courses-no-lessons">

                  {Math.floor(
                    Number(
                      video.durationSeconds
                    ) / 60
                  )}

                  :

                  {String(
                    Number(
                      video.durationSeconds
                    ) % 60
                  ).padStart(2, "0")}

                </span>

              </div>

            </div>

          </article>

        </div>

      )}


      {/* ======================================================
          FORMULARIO
          ====================================================== */}

      {showForm && (

        <AdminVideoForm
          key={
            video?.id ||
            "new-video"
          }
          lessonId={lessonId}
          video={video}
          onSaved={handleSaved}
          onCancel={() => {

            if (!actionLoading) {
              setShowForm(false);
            }

          }}
        />

      )}


      {/* ======================================================
          ELIMINAR
          ====================================================== */}

      {deleteModal && (

        <div className="admin-promotion-modal-overlay">

          <div
            className="
              admin-promotion-modal
              animated-border
              admin-courses-delete-modal
            "
          >

            <div
              className="
                admin-promotion-modal-icon
                private-icon-button
                private-icon-button-red
              "
              aria-hidden="true"
            >

              <i className="bi bi-trash3"></i>

            </div>


            <div className="admin-promotion-modal-content">

              <h2>
                Eliminar video
              </h2>


              <p>
                Esta acción eliminará el video
                asociado a esta lección.
              </p>


              <div className="admin-courses-modal-course">

                <i className="bi bi-play-circle"></i>


                <div>

                  <strong>
                    Video de la lección
                  </strong>


                  <span>

                    YouTube ·{" "}

                    {video?.providerVideoId}

                  </span>

                </div>

              </div>


              <div className="admin-courses-modal-actions">

                <button
                  type="button"
                  className="admin-promotion-cancel-button"
                  onClick={cancelDelete}
                  disabled={actionLoading}
                >

                  <i className="bi bi-x-lg"></i>

                  Cancelar

                </button>


                <button
                  type="button"
                  className="admin-promotion-confirm-button"
                  onClick={confirmDelete}
                  disabled={actionLoading}
                >

                  <i
                    className={
                      actionLoading
                        ? "bi bi-hourglass-split"
                        : "bi bi-trash3"
                    }
                  ></i>


                  {actionLoading
                    ? "Eliminando..."
                    : "Eliminar video"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </section>
  );

};


export default AdminVideos;

