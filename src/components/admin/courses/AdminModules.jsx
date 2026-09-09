import { useCallback, useEffect, useState } from "react";

import {
  getModulesByCourse,
  deleteModule
} from "../../../services/admin/moduleService.js";

import {
  useNavigate
} from "react-router-dom";

import {
  useNotification
} from "../../../hooks/useNotification.js";

import AdminModuleForm from "./AdminModuleForm.jsx";

import "../../../styles/admin/admin-users.css";
import "../../../styles/admin/admin-courses.css";
import "../../../styles/animated-border.css";
import "../../../styles/privateIconButton.css";


const AdminModules = ({
  courseId
}) => {

  const [modules, setModules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  const [deleteModal, setDeleteModal] = useState(null);

  const navigate = useNavigate();

  const notification =
    useNotification();


  // ==========================================================
  // CARGAR MÓDULOS
  // ==========================================================

  const loadModules = useCallback(async () => {

    if (!courseId) {
      return;
    }

    setLoading(true);
    setError("");

    try {

      const data =
        await getModulesByCourse(courseId);

      setModules(
        Array.isArray(data)
          ? data
          : data?.data || []
      );

    } catch (err) {

      setError(
        err.message ||
        "No se pudieron cargar los módulos."
      );

    } finally {

      setLoading(false);

    }

  }, [courseId]);


  useEffect(() => {

    loadModules();

  }, [loadModules]);


  // ==========================================================
  // NUEVO MÓDULO
  // ==========================================================

  const handleNewModule = () => {

    setEditingModule(null);
    setShowForm(true);

  };


  // ==========================================================
  // EDITAR
  // ==========================================================

  const handleEditModule = (module) => {

    setEditingModule(module);
    setShowForm(true);

  };


  // ==========================================================
  // GUARDADO
  // ==========================================================

  const handleSaved = async () => {

    const wasEditing =
      Boolean(editingModule);

    setShowForm(false);
    setEditingModule(null);

    await loadModules();

    if (wasEditing) {

      notification.success({
        title: "¡Módulo actualizado!",
        description:
          "La información del módulo se actualizó correctamente.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    } else {

      notification.success({
        title: "¡Módulo creado!",
        description:
          "El módulo se creó correctamente.",
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

  const handleDelete = (module) => {

    setDeleteModal(module);

  };


  const confirmDelete = async () => {

    if (!deleteModal) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {

      await deleteModule(
        deleteModal.id
      );

      const deletedModule =
        deleteModal;

      setDeleteModal(null);

      await loadModules();

      notification.success({
        title: "¡Módulo eliminado!",
        description:
          `El módulo "${deletedModule.title || "Sin título"}" se eliminó correctamente.`,
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
        "No se pudo eliminar el módulo."
      );

      notification.error({
        title: "Error al eliminar el módulo",
        description:
          err.message ||
          "No fue posible eliminar el módulo.",
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
  modules.length > 0
    ? Math.max(
        ...modules.map(
          (module) =>
            Number(module.order) || 0
        )
      ) + 1
    : 1;


  return (
    <section className="admin-courses-content-section admin-users-panel">


      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <div className="admin-users-results-header">

        <span className="admin-courses-results-count">

          <i
            className="bi bi-collection"
            aria-hidden="true"
          ></i>

          <strong>
            {modules.length}
          </strong>

          <span>
            {modules.length === 1
              ? "módulo"
              : "módulos"}
          </span>

        </span>


        <button
          type="button"
          className="admin-user-promote-button"
          onClick={handleNewModule}
          disabled={actionLoading}
        >

          <i className="bi bi-folder-plus"></i>

          Nuevo módulo

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

          Cargando módulos...

        </div>

      ) : modules.length === 0 ? (

        /* ====================================================
           SIN MÓDULOS
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
            <i className="bi bi-collection"></i>
          </div>

          <h3>
            Este curso todavía no tiene módulos
          </h3>

          <p>
            Crea el primer módulo para comenzar
            a construir el contenido académico.
          </p>

          <button
            type="button"
            className="admin-user-promote-button"
            onClick={handleNewModule}
          >
            <i className="bi bi-folder-plus"></i>
            Crear primer módulo
          </button>

        </div>

      ) : (

        /* ====================================================
           LISTA DE MÓDULOS
           ==================================================== */

        <div className="admin-courses-modules-list">

          {modules.map((module, index) => (

            <article
              key={module.id}
              className="
                admin-courses-module-card
                animated-border
              "
            >

              <div className="admin-courses-module-number">
                {String(
                  module.order ?? index
                ).padStart(2, "0")}
              </div>


              <div className="admin-courses-module-content">

                <div className="admin-courses-module-header">

                  <div>

                    <h3>
                      {module.title}
                    </h3>

                    {module.description && (
                      <p>
                        {module.description}
                      </p>
                    )}

                  </div>


                  <div className="admin-courses-module-actions">

                    <button
                      type="button"
                      className="admin-users-view-button"
                      onClick={() =>
                        handleEditModule(module)
                      }
                      title="Editar módulo"
                      aria-label={`Editar módulo ${module.title}`}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>


                    <button
                      type="button"
                      className="admin-promotion-cancel-button"
                      onClick={() =>
                        handleDelete(module)
                      }
                      title="Eliminar módulo"
                      aria-label={`Eliminar módulo ${module.title}`}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>

                  </div>

                </div>
              
                {/* ============================================
                    LECCIONES
                    ============================================ */}

                <div className="admin-courses-module-lessons">

                  <div className="admin-courses-module-lessons-header">

                    <span>
                      <i className="bi bi-list-ul"></i>
                      Lecciones
                    </span>

                    <button
                      type="button"
                      className="admin-users-view-button"
                      onClick={() =>
                        navigate(
                          `/admin/courses/${encodeURIComponent(courseId)}/content/module/${encodeURIComponent(module.id)}/lessons`
                        )
                      }
                    >
                      <i className="bi bi-arrow-right"></i>
                      Administrar lecciones
                    </button>

                  </div>


                  {module.lessons?.length > 0 ? (

                    <div>

                      {module.lessons.map(
                        (lesson, lessonIndex) => (

                          <div
                            key={lesson.id}
                            className="admin-courses-lesson-preview"
                          >

                            <i className="bi bi-play-circle"></i>

                            <span>
                              {lesson.title ||
                                `Lección ${lessonIndex + 1}`}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="admin-courses-no-lessons">
                      Este módulo todavía no tiene
                      lecciones.
                    </p>

                  )}

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

        <AdminModuleForm
          courseId={courseId}
          module={editingModule}
          nextOrder={nextOrder}
          onSaved={handleSaved}
          onCancel={() => {

            if (!actionLoading) {

              setShowForm(false);
              setEditingModule(null);

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
                Eliminar módulo
              </h2>

              <p>
                Esta acción eliminará el módulo y
                sus lecciones y videos asociados,
                según las relaciones configuradas
                en el sistema.
              </p>


              <div className="admin-courses-modal-course">

                <i className="bi bi-collection"></i>

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
                    : "Eliminar módulo"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </section>
  );

};


export default AdminModules;
