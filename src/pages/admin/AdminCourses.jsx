/* ============================================================
   ADMIN COURSES
   Administración de cursos académicos.
   ============================================================ */

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getAdminCourses,
  createCourse,
  updateCourse,
  updateCourseStatus,
  deleteCourse
} from "../../services/admin/courseService.js";

import {
  useNotification
} from "../../hooks/useNotification.js";

import AdminCoursesTable
  from "../../components/admin/AdminCoursesTable";

import AdminCourseForm
  from "../../components//admin/AdminCourseForm";

import AdminCourseDetails
  from "../../components/admin/AdminCourseDetails";

import "../../styles/admin/admin-users.css";
import "../../styles/admin/admin-courses.css";
import "../../styles/animated-border.css";
import "../../styles/privateIconButton.css";


function AdminCourses() {

  /* ============================================================
     NAVEGACIÓN
     ============================================================ */

  const navigate = useNavigate();


  /* ============================================================
     NOTIFICACIONES
     ============================================================ */

  const notification =
    useNotification();


  /* ============================================================
     ESTADO
     ============================================================ */

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [editingCourse, setEditingCourse] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);


  /* ============================================================
     MODAL — CAMBIO DE ESTADO
     ============================================================ */

  const [statusModal, setStatusModal] =
    useState({
      open: false,
      course: null,
      status: null
    });


  /* ============================================================
     MODAL — ELIMINAR
     ============================================================ */

  const [deleteModal, setDeleteModal] =
    useState({
      open: false,
      course: null
    });


  /* ============================================================
     CARGAR CURSOS
     ============================================================ */

  const loadCourses = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getAdminCourses();


      /*
       * El backend puede devolver:
       *
       * {
       *   courses: [...]
       * }
       *
       * o directamente:
       *
       * [...]
       */

      const data =
        Array.isArray(response)
          ? response
          : response?.courses ||
            response?.data ||
            [];


      setCourses(data);

    } catch (err) {

      console.error(
        "Error obteniendo cursos:",
        err
      );

      setError(
        err.message ||
        "No fue posible obtener los cursos."
      );

    } finally {

      setLoading(false);

    }

  };


  /* ============================================================
     CARGA INICIAL
     ============================================================ */

  useEffect(() => {

    loadCourses();

  }, []);


  /* ============================================================
     CURSOS FILTRADOS
     ============================================================ */

  const filteredCourses =
    useMemo(() => {

      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase("es-MX");


      return courses.filter(
        (course) => {

          const matchesSearch =
            !normalizedSearch ||
            (course.title || "")
              .toLocaleLowerCase("es-MX")
              .includes(
                normalizedSearch
              ) ||
            (course.description || "")
              .toLocaleLowerCase("es-MX")
              .includes(
                normalizedSearch
              );


          const matchesStatus =
            statusFilter === "all" ||
            course.status === statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      courses,
      search,
      statusFilter
    ]);


  /* ============================================================
     ESTADÍSTICAS
     ============================================================ */

  const totalCourses =
    courses.length;

  const draftCourses =
    courses.filter(
      (course) =>
        course.status === "DRAFT"
    ).length;

  const publishedCourses =
    courses.filter(
      (course) =>
        course.status === "PUBLISHED"
    ).length;

  const archivedCourses =
    courses.filter(
      (course) =>
        course.status === "ARCHIVED"
    ).length;


  /* ============================================================
     CREAR
     ============================================================ */

  const handleCreate = async (
    courseData
  ) => {

    try {

      setActionLoading(true);
      setError("");

      await createCourse(
        courseData
      );

      setShowForm(false);

      setEditingCourse(null);

      await loadCourses();


      /* ========================================================
         NOTIFICACIÓN — CREACIÓN
         ======================================================== */

      notification.success({

        title:
          "¡Curso creado!",

        description:
          "El curso se creó correctamente.",

        placement:
          "topRight",

        duration:
          8,

        showProgress:
          true,

        pauseOnHover:
          true,

        closable:
          true,

        className:
          "welcome-notification",

      });

    } catch (err) {

      console.error(
        "Error creando curso:",
        err
      );

      setError(
        err.message ||
        "No fue posible crear el curso."
      );


      /* ========================================================
         NOTIFICACIÓN — ERROR CREACIÓN
         ======================================================== */

      notification.error({

        title:
          "Error al crear el curso",

        description:
          err.message ||
          "No fue posible crear el curso.",

        placement:
          "topRight",

        duration:
          8,

        showProgress:
          true,

        pauseOnHover:
          true,

        closable:
          true,

        className:
          "welcome-notification",

      });

    } finally {

      setActionLoading(false);

    }

  };


  /* ============================================================
     EDITAR
     ============================================================ */

  const handleUpdate = async (
    courseData
  ) => {

    if (!editingCourse?.id) {
      return;
    }

    try {

      setActionLoading(true);
      setError("");

      await updateCourse(
        editingCourse.id,
        courseData
      );

      setShowForm(false);

      setEditingCourse(null);

      setSelectedCourse(null);

      await loadCourses();


      /* ========================================================
         NOTIFICACIÓN — ACTUALIZACIÓN
         ======================================================== */

      notification.success({

        title:
          "¡Curso actualizado!",

        description:
          "La información del curso se actualizó correctamente.",

        placement:
          "topRight",

        duration:
          8,

        showProgress:
          true,

        pauseOnHover:
          true,

        closable:
          true,

        className:
          "welcome-notification",

      });

    } catch (err) {

      console.error(
        "Error actualizando curso:",
        err
      );

      setError(
        err.message ||
        "No fue posible actualizar el curso."
      );


      /* ========================================================
         NOTIFICACIÓN — ERROR ACTUALIZACIÓN
         ======================================================== */

      notification.error({

        title:
          "Error al actualizar el curso",

        description:
          err.message ||
          "No fue posible actualizar el curso.",

        placement:
          "topRight",

        duration:
          8,

        showProgress:
          true,

        pauseOnHover:
          true,

        closable:
          true,

        className:
          "welcome-notification",

      });

    } finally {

      setActionLoading(false);

    }

  };


  /* ============================================================
     ABRIR MODAL DE ESTADO
     ============================================================ */

  const handleChangeStatus = (
    course,
    status
  ) => {

    if (!course?.id) {
      return;
    }

    if (
      status !== "PUBLISHED" &&
      status !== "ARCHIVED"
    ) {
      return;
    }

    setError("");

    setStatusModal({
      open: true,
      course,
      status
    });

  };


  /* ============================================================
     CERRAR MODAL DE ESTADO
     ============================================================ */

  const closeStatusModal = () => {

    if (actionLoading) {
      return;
    }

    setStatusModal({
      open: false,
      course: null,
      status: null
    });

  };


  /* ============================================================
     CONFIRMAR CAMBIO DE ESTADO
     ============================================================ */

  const handleConfirmStatus = async () => {

    const course =
      statusModal.course;

    const status =
      statusModal.status;


    if (
      !course?.id ||
      !status
    ) {
      return;
    }


    try {

      setActionLoading(true);
      setError("");


      await updateCourseStatus(
        course.id,
        status
      );


      setStatusModal({
        open: false,
        course: null,
        status: null
      });


      await loadCourses();


      /* ========================================================
         NOTIFICACIÓN — CAMBIO DE ESTADO
         ======================================================== */

      if (
        status === "PUBLISHED"
      ) {

        notification.success({

          title:
            "¡Curso publicado!",

          description:
            `El curso "${course.title || "Sin título"}" fue publicado correctamente.`,

          placement:
            "topRight",

          duration:
            8,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification",

        });

      } else if (
        status === "ARCHIVED"
      ) {

        notification.success({

          title:
            "¡Curso archivado!",

          description:
            `El curso "${course.title || "Sin título"}" fue archivado correctamente.`,

          placement:
            "topRight",

          duration:
            8,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification",

        });

      }

    } catch (err) {

      console.error(
        "Error cambiando estado:",
        err
      );

      setError(
        err.message ||
        "No fue posible cambiar el estado del curso."
      );


      /* ========================================================
         NOTIFICACIÓN — ERROR CAMBIO DE ESTADO
         ======================================================== */

      notification.error({

        title:
          status === "PUBLISHED"
            ? "Error al publicar el curso"
            : "Error al archivar el curso",

        description:
          err.message ||
          "No fue posible cambiar el estado del curso.",

        placement:
          "topRight",

        duration:
          8,

        showProgress:
          true,

        pauseOnHover:
          true,

        closable:
          true,

        className:
          "welcome-notification",

      });

    } finally {

      setActionLoading(false);

    }

  };


  /* ============================================================
     ABRIR MODAL DE ELIMINACIÓN
     ============================================================ */

  const handleDelete = (
    course
  ) => {

    if (!course?.id) {
      return;
    }

    setError("");

    setDeleteModal({
      open: true,
      course
    });

  };


  /* ============================================================
     CERRAR MODAL DE ELIMINACIÓN
     ============================================================ */

  const closeDeleteModal = () => {

    if (actionLoading) {
      return;
    }

    setDeleteModal({
      open: false,
      course: null
    });

  };


  /* ============================================================
     CONFIRMAR ELIMINACIÓN
     ============================================================ */

  const handleConfirmDelete = async () => {

    const course =
      deleteModal.course;


    if (!course?.id) {
      return;
    }


    try {

      setActionLoading(true);
      setError("");


      await deleteCourse(
        course.id
      );


      if (
        selectedCourse?.id ===
        course.id
      ) {

        setSelectedCourse(null);

      }


      setDeleteModal({
        open: false,
        course: null
      });


      await loadCourses();


      /* ========================================================
         NOTIFICACIÓN — ELIMINACIÓN
         ======================================================== */

      notification.success({

        title:
          "¡Curso eliminado!",

        description:
          `El curso "${course.title || "Sin título"}" se eliminó correctamente.`,

        placement:
          "topRight",

        duration:
          8,

        showProgress:
          true,

        pauseOnHover:
          true,

        closable:
          true,

        className:
          "welcome-notification",

      });

    } catch (err) {

      console.error(
        "Error eliminando curso:",
        err
      );

      setError(
        err.message ||
        "No fue posible eliminar el curso."
      );


      /* ========================================================
         NOTIFICACIÓN — ERROR ELIMINACIÓN
         ======================================================== */

      notification.error({

        title:
          "Error al eliminar el curso",

        description:
          err.message ||
          "No fue posible eliminar el curso.",

        placement:
          "topRight",

        duration:
          8,

        showProgress:
          true,

        pauseOnHover:
          true,

        closable:
          true,

        className:
          "welcome-notification",

      });

    } finally {

      setActionLoading(false);

    }

  };


  /* ============================================================
     EDITAR DESDE DETALLE
     ============================================================ */

  const handleEditFromDetails =
    (course) => {

      setSelectedCourse(null);

      setEditingCourse(course);

      setShowForm(true);

    };


  /* ============================================================
     ADMINISTRAR CONTENIDO
     ============================================================ */

  const handleContent =
    (course) => {

      if (!course?.id) {
        return;
      }

      navigate(
        `/admin/courses/${course.id}/content`
      );

    };


  /* ============================================================
     LIMPIAR FILTROS
     ============================================================ */

  const clearFilters = () => {

    setSearch("");

    setStatusFilter("all");

  };


  /* ============================================================
     RENDER
     ============================================================ */

  const isPublishModal =
    statusModal.status === "PUBLISHED";

  const isArchiveModal =
    statusModal.status === "ARCHIVED";


  return (

    <div className="admin-users-page">

      {/* ========================================================
          ENCABEZADO
          ======================================================== */}

      <header className="private-page-header">

        <h1>
          Cursos
        </h1>

        <p>
          Administración de cursos académicos.
        </p>

      </header>


      {/* ========================================================
          RESUMEN
          ======================================================== */}

      <section className="admin-users-summary">

        {/* Total */}

        <div className="admin-users-summary-card animated-border">

          <div
            className="
              admin-users-summary-icon
              private-icon-button
              private-icon-button-blue
            "
            aria-hidden="true"
          >

            <i className="bi bi-journal-bookmark"></i>

          </div>

          <div className="admin-users-summary-content">

            <span>
              Total
            </span>

            <strong>
              {totalCourses}
            </strong>

            <small>
              Cursos registrados
            </small>

          </div>

        </div>


        {/* Publicados */}

        <div className="admin-users-summary-card animated-border">

          <div
            className="
              admin-users-summary-icon
              private-icon-button
              private-icon-button-green
            "
            aria-hidden="true"
          >

            <i className="bi bi-check-circle"></i>

          </div>

          <div className="admin-users-summary-content">

            <span>
              Publicados
            </span>

            <strong>
              {publishedCourses}
            </strong>

            <small>
              Disponibles para alumnos
            </small>

          </div>

        </div>


        {/* Borradores */}

        <div className="admin-users-summary-card animated-border">

          <div
            className="
              admin-users-summary-icon
              private-icon-button
              private-icon-button-purple
            "
            aria-hidden="true"
          >

            <i className="bi bi-pencil-square"></i>

          </div>

          <div className="admin-users-summary-content">

            <span>
              Borradores
            </span>

            <strong>
              {draftCourses}
            </strong>

            <small>
              En preparación
            </small>

          </div>

        </div>


        {/* Archivados */}

        <div className="admin-users-summary-card animated-border">

          <div
            className="
              admin-users-summary-icon
              private-icon-button
              private-icon-button-orange
            "
            aria-hidden="true"
          >

            <i className="bi bi-archive"></i>

          </div>

          <div className="admin-users-summary-content">

            <span>
              Archivados
            </span>

            <strong>
              {archivedCourses}
            </strong>

            <small>
              Fuera del catálogo
            </small>

          </div>

        </div>

      </section>


      {/* ========================================================
          PANEL
          ======================================================== */}

      <section className="admin-users-panel animated-border">


        {/* ======================================================
            FILTROS
            ====================================================== */}

        <div className="admin-users-filters">


          {/* Buscador */}

          <div className="admin-users-search">

            <i className="bi bi-search"></i>

            <input
              type="search"
              placeholder="Buscar curso..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          {/* Estado */}

          <div className="admin-users-filter">

            <label htmlFor="course-status-filter">
              Estado
            </label>

            <select
              id="course-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >

              <option value="all">
                Todos
              </option>

              <option value="DRAFT">
                Borradores
              </option>

              <option value="PUBLISHED">
                Publicados
              </option>

              <option value="ARCHIVED">
                Archivados
              </option>

            </select>

          </div>


          {/* Crear */}

          <div className="admin-users-filter">

            <label>
              Administración
            </label>

            <button
              type="button"
              className="admin-user-promote-button"
              style={{
                marginTop: 0
              }}
              onClick={() => {

                setEditingCourse(null);

                setShowForm(true);

              }}
              disabled={actionLoading}
            >

              <i className="bi bi-plus-lg"></i>

              <span>
                Nuevo curso
              </span>

            </button>

          </div>


          {/* Limpiar */}

          <button
            type="button"
            className="admin-promotion-cancel-button"
            onClick={clearFilters}
          >

            <i className="bi bi-arrow-counterclockwise"></i>

            Limpiar

          </button>


        </div>


        {/* ======================================================
            ERROR
            ====================================================== */}

        {error && (

          <div
            className="admin-promotion-modal-warning"
            style={{
              marginTop: "1rem"
            }}
          >

            <i
              className="bi bi-exclamation-triangle"
              aria-hidden="true"
            ></i>

            <div>

              <strong>
                Ocurrió un problema
              </strong>

              <span>
                {error}
              </span>

            </div>

          </div>

        )}


        {/* ======================================================
            RESULTADOS
            ====================================================== */}

        <div className="admin-users-results-header">

          <span className="admin-courses-results-count">

            <i
              className="bi bi-journal-bookmark"
              aria-hidden="true"
            ></i>

            <strong>
              {filteredCourses.length}
            </strong>

            <span>
              {filteredCourses.length === 1
                ? "Curso"
                : "Cursos"}
            </span>

          </span>

          {actionLoading && (

            <span>
              Procesando...
            </span>

          )}

        </div>


        {/* ======================================================
            TABLA
            ====================================================== */}

        {loading ? (

          <div className="admin-users-empty">

            <div className="admin-users-empty-icon">

              <i className="bi bi-hourglass-split"></i>

            </div>

            <h3>
              Cargando cursos...
            </h3>

            <p>
              Obteniendo información académica.
            </p>

          </div>

        ) : (

          <AdminCoursesTable
            courses={filteredCourses}

            onSelectCourse={
              setSelectedCourse
            }

            onEditCourse={
              (course) => {

                setEditingCourse(course);

                setShowForm(true);

              }
            }

            onContent={
              handleContent
            }

            onChangeStatus={
              handleChangeStatus
            }

            onDeleteCourse={
              handleDelete
            }
          />

        )}

      </section>


      {/* ========================================================
          DETALLE
          ======================================================== */}

      {selectedCourse && (

        <AdminCourseDetails
          course={selectedCourse}
          onClose={() =>
            setSelectedCourse(null)
          }
          onEdit={
            handleEditFromDetails
          }
        />

      )}


      {/* ========================================================
          FORMULARIO
          ======================================================== */}

      {showForm && (

        <AdminCourseForm
          course={editingCourse}
          loading={actionLoading}
          onCancel={() => {

            if (actionLoading) {
              return;
            }

            setShowForm(false);

            setEditingCourse(null);

          }}
          onSubmit={
            editingCourse
              ? handleUpdate
              : handleCreate
          }
        />

      )}


      {/* ========================================================
          MODAL — PUBLICAR / ARCHIVAR
          ======================================================== */}

      {statusModal.open && statusModal.course && (

        <div
          className="admin-courses-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {

            if (
              event.target === event.currentTarget &&
              !actionLoading
            ) {

              closeStatusModal();

            }

          }}
        >

          <div
            className="admin-courses-modal animated-border"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-courses-modal-title"
            aria-describedby="admin-courses-modal-description"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div
              className={
                `
                admin-courses-modal-icon
                private-icon-button
                ${
                  isPublishModal
                    ? "private-icon-button-blue"
                    : "private-icon-button-orange"
                }
                `
              }
              aria-hidden="true"
            >

              <i
                className={
                  isPublishModal
                    ? "bi bi-cloud-arrow-up"
                    : "bi bi-archive"
                }
              ></i>

            </div>


            <div className="admin-courses-modal-content">

              <h2 id="admin-courses-modal-title">

                {isPublishModal
                  ? "Publicar curso"
                  : "Archivar curso"}

              </h2>


              <p id="admin-courses-modal-description">

                {isPublishModal
                  ? "Estás a punto de publicar el siguiente curso:"
                  : "Estás a punto de archivar el siguiente curso:"}

              </p>


              <div className="admin-courses-modal-course">

                <i
                  className="bi bi-journal-bookmark"
                  aria-hidden="true"
                ></i>

                <div>

                  <strong>
                    {statusModal.course.title ||
                      "Sin título"}
                  </strong>

                  <span>

                    {isPublishModal
                      ? "El curso estará disponible para los alumnos."
                      : "El curso dejará de estar disponible en el catálogo."}

                  </span>

                </div>

              </div>


              <div className="admin-promotion-modal-warning">

                <i
                  className={
                    isPublishModal
                      ? "bi bi-info-circle"
                      : "bi bi-exclamation-triangle"
                  }
                  aria-hidden="true"
                ></i>

                <div>

                  <strong>

                    {isPublishModal
                      ? "Confirmación de publicación"
                      : "Confirmación de archivado"}

                  </strong>

                  <span>

                    {isPublishModal
                      ? "Confirma que deseas cambiar el estado de este curso a publicado."
                      : "Confirma que deseas cambiar el estado de este curso a archivado."}

                  </span>

                </div>

              </div>

            </div>


            <div className="admin-courses-modal-actions">

              <button
                type="button"
                className="admin-promotion-cancel-button"
                onClick={
                  closeStatusModal
                }
                disabled={actionLoading}
              >

                <i
                  className="bi bi-x-lg"
                  aria-hidden="true"
                ></i>

                <span>
                  Cancelar
                </span>

              </button>


              <button
                type="button"
                className={
                  isPublishModal
                    ? "admin-user-promote-button"
                    : "admin-users-view-button"
                }
                onClick={
                  handleConfirmStatus
                }
                disabled={actionLoading}
              >

                <i
                  className={
                    actionLoading
                      ? "bi bi-hourglass-split"
                      : isPublishModal
                        ? "bi bi-cloud-arrow-up"
                        : "bi bi-archive"
                  }
                  aria-hidden="true"
                ></i>

                <span>

                  {actionLoading
                    ? "Procesando..."
                    : isPublishModal
                      ? "Publicar curso"
                      : "Archivar curso"}

                </span>

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ========================================================
          MODAL — ELIMINAR
          ======================================================== */}

      {deleteModal.open && deleteModal.course && (

        <div
          className="admin-courses-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {

            if (
              event.target === event.currentTarget &&
              !actionLoading
            ) {

              closeDeleteModal();

            }

          }}
        >

          <div
            className="
              admin-courses-modal
              admin-courses-delete-modal
              animated-border
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-courses-delete-modal-title"
            aria-describedby="admin-courses-delete-modal-description"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* ==================================================
                ICONO
                ================================================== */}

            <div
              className="
                admin-courses-modal-icon
                private-icon-button
                private-icon-button-red
              "
              aria-hidden="true"
            >

              <i className="bi bi-trash"></i>

            </div>


            {/* ==================================================
                CONTENIDO
                ================================================== */}

            <div className="admin-courses-modal-content">

              <h2 id="admin-courses-delete-modal-title">
                Eliminar curso
              </h2>


              <p id="admin-courses-delete-modal-description">

                Estás a punto de eliminar permanentemente
                el siguiente curso:

              </p>


              <div className="admin-courses-modal-course">

                <i
                  className="bi bi-journal-bookmark"
                  aria-hidden="true"
                ></i>

                <div>

                  <strong>
                    {deleteModal.course.title ||
                      "Sin título"}
                  </strong>

                  <span>
                    Esta acción eliminará el curso
                    y no podrá deshacerse.
                  </span>

                </div>

              </div>


              {/* ==================================================
                  ADVERTENCIA
                  ================================================== */}

              <div className="admin-promotion-modal-warning">

                <i
                  className="bi bi-exclamation-triangle"
                  aria-hidden="true"
                ></i>

                <div>

                  <strong>
                    Esta acción no se puede deshacer
                  </strong>

                  <span>
                    Verifica que deseas eliminar este
                    curso antes de continuar.
                  </span>

                </div>

              </div>

            </div>


            {/* ==================================================
                ACCIONES
                ================================================== */}

            <div className="admin-courses-modal-actions">

              {/* Cancelar */}

              <button
                type="button"
                className="admin-promotion-cancel-button"
                onClick={
                  closeDeleteModal
                }
                disabled={actionLoading}
              >

                <i
                  className="bi bi-x-lg"
                  aria-hidden="true"
                ></i>

                <span>
                  Cancelar
                </span>

              </button>


              {/* Eliminar */}

              <button
                type="button"
                className="admin-promotion-cancel-button"
                onClick={
                  handleConfirmDelete
                }
                disabled={actionLoading}
              >

                <i
                  className={
                    actionLoading
                      ? "bi bi-hourglass-split"
                      : "bi bi-trash"
                  }
                  aria-hidden="true"
                ></i>

                <span>

                  {actionLoading
                    ? "Eliminando..."
                    : "Eliminar curso"}

                </span>

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


export default AdminCourses;

