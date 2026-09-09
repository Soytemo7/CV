import {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  getLessonsByModule,
  deleteLesson
} from "../../../services/admin/lessonService.js";

import {
  getVideoByLesson
} from "../../../services/admin/videoService.js";

import AdminLessonForm
  from "./AdminLessonForm.jsx";

import {
  useNotification
} from "../../../hooks/useNotification.js";

import "../../../styles/admin/admin-users.css";
import "../../../styles/admin/admin-courses.css";
import "../../../styles/animated-border.css";
import "../../../styles/privateIconButton.css";

import {
  useNavigate
} from "react-router-dom";


const AdminLessons = ({
  courseId,
  moduleId
}) => {

  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const [deleteModal, setDeleteModal] = useState(null);

  const navigate = useNavigate();

  const notification =
    useNotification();


  // ==========================================================
  // CARGAR LECCIONES
  // ==========================================================

  const loadLessons = useCallback(async () => {

    if (!moduleId) {
      return;
    }

    setLoading(true);
    setError("");

    try {

      const data =
        await getLessonsByModule(moduleId);


      const loadedLessons =
        Array.isArray(data)
          ? data
          : data?.data || [];


      /*
       * Obtener el video asociado a cada lección.
       *
       * Si una lección no tiene video, simplemente
       * se asigna null.
       *
       * Un error en una lección no impide cargar
       * las demás.
       */

      const lessonsWithVideos =
        await Promise.all(
          loadedLessons.map(
            async (lesson) => {

              try {

                const videoData =
                  await getVideoByLesson(
                    lesson.id
                  );


                return {
                  ...lesson,
                  video:
                    videoData?.video || null
                };

              } catch {

                return {
                  ...lesson,
                  video: null
                };

              }

            }
          )
        );


      setLessons(
        lessonsWithVideos
      );

    } catch (err) {

      setError(
        err.message ||
        "No se pudieron cargar las lecciones."
      );

    } finally {

      setLoading(false);

    }

  }, [moduleId]);


  useEffect(() => {

    loadLessons();

  }, [loadLessons]);


  // ==========================================================
  // NUEVA LECCIÓN
  // ==========================================================

  const handleNewLesson = () => {

    setEditingLesson(null);
    setShowForm(true);

  };


  // ==========================================================
  // EDITAR
  // ==========================================================

  const handleEditLesson = (lesson) => {

    setEditingLesson(lesson);
    setShowForm(true);

  };


  // ==========================================================
  // GUARDADO
  // ==========================================================

  const handleSaved = async () => {

    const wasEditing =
      Boolean(editingLesson);

    setShowForm(false);
    setEditingLesson(null);

    await loadLessons();

    if (wasEditing) {

      notification.success({
        title: "¡Lección actualizada!",
        description:
          "La información de la lección se actualizó correctamente.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    } else {

      notification.success({
        title: "¡Lección creada!",
        description:
          "La lección se creó correctamente.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    }

  };


  // ==========================================================
  // ELIMINAR
  // ==========================================================

  const handleDelete = (lesson) => {

    setDeleteModal(lesson);

  };


  const confirmDelete = async () => {

    if (!deleteModal) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {

      await deleteLesson(
        deleteModal.id
      );

      const deletedLesson =
        deleteModal;

      setDeleteModal(null);

      await loadLessons();

      notification.success({
        title: "¡Lección eliminada!",
        description:
          `La lección "${deletedLesson.title || "Sin título"}" se eliminó correctamente.`,
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
        "No se pudo eliminar la lección."
      );

      notification.error({
        title: "Error al eliminar la lección",
        description:
          err.message ||
          "No fue posible eliminar la lección.",
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


  // ==========================================================
  // CANCELAR ELIMINACIÓN
  // ==========================================================

  const cancelDelete = () => {

    if (actionLoading) {
      return;
    }

    setDeleteModal(null);

  };


  // ==========================================================
  // SIGUIENTE ORDEN
  // ==========================================================

  const nextOrder =
    lessons.length > 0
      ? Math.max(
          ...lessons.map(
            (lesson) =>
              Number(lesson.order) || 0
          )
        ) + 1
      : 1;


  return (
    <section className="admin-courses-content-section admin-users-panel">


      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <div className="admin-courses-module-lessons">

        <div className="admin-courses-module-lessons-header">

          <span>

            <span
              className="
                private-icon-button
                private-icon-button-blue
              "
              aria-hidden="true"
            >

              <i className="bi bi-list-ul"></i>

            </span>

            Administración de lecciones

          </span>

        </div>


        <p className="admin-courses-no-lessons">

          Administra las lecciones que forman parte
          de este módulo.

        </p>

      </div>


      {/* ======================================================
          RESULTADOS
          ====================================================== */}

      <div className="admin-users-results-header">

        <span className="admin-courses-results-count">

          <i
            className="bi bi-list-ul"
            aria-hidden="true"
          ></i>

          <strong>
            {lessons.length}
          </strong>

          <span>
            {lessons.length === 1
              ? "lección"
              : "lecciones"}
          </span>

        </span>


        <button
          type="button"
          className="admin-user-promote-button"
          onClick={handleNewLesson}
          disabled={actionLoading}
        >

          <i className="bi bi-plus-lg"></i>

          Nueva lección

        </button>

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
          CARGANDO
          ====================================================== */}

      {loading ? (

        <div className="admin-users-loading">

          <i className="bi bi-hourglass-split"></i>

          Cargando lecciones...

        </div>

      ) : lessons.length === 0 ? (

        /* ====================================================
           SIN LECCIONES
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

            <i className="bi bi-list-ul"></i>

          </div>


          <h3>
            Este módulo todavía no tiene lecciones
          </h3>


          <p>
            Crea la primera lección para comenzar
            a construir el contenido del módulo.
          </p>


          <button
            type="button"
            className="admin-user-promote-button"
            onClick={handleNewLesson}
          >

            <i className="bi bi-plus-lg"></i>

            Crear primera lección

          </button>

        </div>

      ) : (

        /* ====================================================
           LISTA DE LECCIONES
           ==================================================== */

        <div className="admin-courses-lessons-list">

          {lessons.map((lesson, index) => (

            <article
              key={lesson.id}
              className="
                admin-courses-lesson-card
                animated-border
              "
            >

              <div className="admin-courses-lesson-number">

                {String(
                  lesson.order ?? index + 1
                ).padStart(2, "0")}

              </div>


              <div className="admin-courses-lesson-content">

                <div className="admin-courses-lesson-header">

                  <div>

                    <h3>
                      {lesson.title}
                    </h3>

                    {lesson.description && (
                      <p>
                        {lesson.description}
                      </p>
                    )}

                  </div>


                  <div className="admin-courses-module-actions">

                    <button
                      type="button"
                      className="admin-users-view-button"
                      onClick={() =>
                        handleEditLesson(lesson)
                      }
                      title="Editar lección"
                      aria-label={`Editar lección ${lesson.title}`}
                    >

                      <i className="bi bi-pencil-square"></i>

                    </button>


                    <button
                      type="button"
                      className="admin-promotion-cancel-button"
                      onClick={() =>
                        handleDelete(lesson)
                      }
                      title="Eliminar lección"
                      aria-label={`Eliminar lección ${lesson.title}`}
                    >

                      <i className="bi bi-trash3"></i>

                    </button>

                  </div>

                </div>


                {/* ==========================================
                    VIDEO
                    ========================================== */}

                <div className="admin-courses-lesson-videos">

                  <span>

                    <i className="bi bi-play-circle"></i>

                    {lesson.video?.title ||
                      "Sin video"}

                  </span>


                  <button
                    type="button"
                    className="admin-users-view-button"
                    onClick={() =>
                      navigate(
                        `/admin/courses/${encodeURIComponent(courseId)}/content/module/${encodeURIComponent(moduleId)}/lessons/${encodeURIComponent(lesson.id)}/video`
                      )
                    }
                  >

                    <i className="bi bi-arrow-right"></i>

                    Administrar video

                  </button>

                </div>

              </div>

            </article>

          ))}

        </div>

      )}


      {/* ======================================================
          FORMULARIO
          ====================================================== */}

      {showForm && (

        <AdminLessonForm
          moduleId={moduleId}
          lesson={editingLesson}
          nextOrder={nextOrder}
          onSaved={handleSaved}
          onCancel={() => {

            if (!actionLoading) {

              setShowForm(false);
              setEditingLesson(null);

            }

          }}
        />

      )}


      {/* ======================================================
          MODAL ELIMINAR
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
                Eliminar lección
              </h2>


              <p>
                Esta acción eliminará la lección
                y los videos asociados, según las
                relaciones configuradas en el sistema.
              </p>


              <div className="admin-courses-modal-course">

                <i className="bi bi-list-ul"></i>


                <div>

                  <strong>
                    {deleteModal.title}
                  </strong>


                  {deleteModal.description && (
                    <span>
                      {deleteModal.description}
                    </span>
                  )}

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
                    : "Eliminar lección"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </section>
  );

};


export default AdminLessons;
