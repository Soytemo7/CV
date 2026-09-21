import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getAdminAcademicEvents
} from "../../services/admin/academicEventService.js";

import {
  getAdminCourses
} from "../../services/admin/courseService.js";

import "../../styles/admin/admin-academic-events.css";
import "../../styles/admin/admin-users.css";
import "../../styles/animated-border.css";
import "../../styles/privateIconButton.css";


const EVENT_LABELS = {

  ENROLLMENT_CREATED:
    "Inscripción creada",

  VIDEO_COMPLETED:
    "Video completado",

  EXAM_STARTED:
    "Examen iniciado",

  EXAM_SUBMITTED:
    "Examen enviado",

  EXAM_PASSED:
    "Examen aprobado",

  EXAM_FAILED:
    "Examen reprobado",

  CERTIFICATE_ISSUED:
    "Constancia emitida"

};


const EVENT_ICONS = {

  ENROLLMENT_CREATED:
    "bi bi-person-plus",

  VIDEO_COMPLETED:
    "bi bi-play-circle-fill",

  EXAM_STARTED:
    "bi bi-clipboard-play",

  EXAM_SUBMITTED:
    "bi bi-clipboard-check",

  EXAM_PASSED:
    "bi bi-check2-circle",

  EXAM_FAILED:
    "bi bi-x-circle",

  CERTIFICATE_ISSUED:
    "bi bi-patch-check-fill"

};


const formatDate =
  (value) => {

    if (!value) {
      return "Desconocido";
    }

    return new Date(
      value
    ).toLocaleString(
      "es-MX",
      {
        dateStyle:
          "medium",
        timeStyle:
          "short"
      }
    );

  };


function AdminAcademicEvents() {

  const navigate =
    useNavigate();


  const [
    events,
    setEvents
  ] = useState([]);


  const [
    courses,
    setCourses
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    loadingCourses,
    setLoadingCourses
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    from,
    setFrom
  ] = useState("");


  const [
    to,
    setTo
  ] = useState("");


  const [
    eventType,
    setEventType
  ] = useState("");


  const [
    courseId,
    setCourseId
  ] = useState("");


  const [
    student,
    setStudent
  ] = useState("");


  const [
    page,
    setPage
  ] = useState(1);


  const [
    pagination,
    setPagination
  ] = useState({

    page:
      1,

    limit:
      20,

    total:
      0,

    totalPages:
      0

  });


  // ==========================================================
  // TIPOS DE EVENTO
  // ==========================================================

  const eventTypes =
    useMemo(
      () =>
        Object.keys(
          EVENT_LABELS
        ),
      []
    );


  // ==========================================================
  // CARGAR CURSOS
  // ==========================================================

  const loadCourses =
    useCallback(
      async () => {

        try {

          setLoadingCourses(
            true
          );


          const response =
            await getAdminCourses();


          const data =
            Array.isArray(
              response
            )
              ? response
              : response?.courses ||
                response?.data ||
                [];


          setCourses(
            data
          );

        } catch (err) {

          console.error(
            "Error obteniendo cursos:",
            err
          );

        } finally {

          setLoadingCourses(
            false
          );

        }

      },
      []
    );


  // ==========================================================
  // CARGAR EVENTOS
  // ==========================================================

  const loadEvents =
    useCallback(
      async () => {

        try {

          setLoading(
            true
          );

          setError("");


          const response =
            await getAdminAcademicEvents({

              from,

              to,

              eventType,

              courseId,

              student,

              page,

              limit:
                20

            });


          setEvents(
            response?.events ||
            []
          );


          setPagination(
            response?.pagination || {

              page,

              limit:
                20,

              total:
                0,

              totalPages:
                0

            }
          );

        } catch (err) {

          console.error(
            "Error obteniendo historial académico:",
            err
          );


          setError(
            err.message ||
            "No fue posible obtener el historial académico."
          );

        } finally {

          setLoading(
            false
          );

        }

      },
      [
        from,
        to,
        eventType,
        courseId,
        student,
        page
      ]
    );


  // ==========================================================
  // CARGA INICIAL
  // ==========================================================

  useEffect(() => {

    loadCourses();

  }, [
    loadCourses
  ]);


  useEffect(() => {

    loadEvents();

  }, [
    loadEvents
  ]);


  // ==========================================================
  // APLICAR FILTROS
  // ==========================================================

  const handleFilter =
    (event) => {

      event.preventDefault();

      setPage(
        1
      );

    };


  // ==========================================================
  // LIMPIAR FILTROS
  // ==========================================================

  const handleClear =
    () => {

      setFrom("");

      setTo("");

      setEventType("");

      setCourseId("");

      setStudent("");

      setPage(
        1
      );

    };


  // ==========================================================
  // PAGINACIÓN
  // ==========================================================

  const handlePrevious =
    () => {

      if (
        page <=
        1
      ) {
        return;
      }

      setPage(
        previous =>
          previous - 1
      );

    };


  const handleNext =
    () => {

      if (
        page >=
        pagination.totalPages
      ) {
        return;
      }

      setPage(
        previous =>
          previous + 1
      );

    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        admin-users-page
        admin-academic-events-page
      "
    >

      {/* ======================================================
          VOLVER AL DASHBOARD
          ====================================================== */}

        <button
  type="button"
  className="
    admin-user-promote-button
    admin-academic-events-back-button
  "
  onClick={() =>
    navigate("/admin")
  }
>
  <i
    className="
      bi bi-arrow-left
    "
  ></i>

  Volver al dashboard
</button>


      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <header
        className="
          private-page-header
        "
      >

        <span
          className="
            private-page-eyebrow
          "
        >
          Administración académica
        </span>


        <h1>
          Historial académico
        </h1>


        <p>
          Consulta la trazabilidad de las actividades
          académicas registradas en la plataforma.
        </p>

      </header>


      {/* ======================================================
          FILTROS
          ====================================================== */}

      <section
        className="
          admin-users-panel
          animated-border
          admin-academic-events-filters
        "
      >

        <div
          className="
            private-card-header
          "
        >

          <div
            className="
              private-card-icon
            "
          >

            <i
              className="
                bi bi-funnel
              "
            ></i>

          </div>


          <div>

            <h2>
              Filtros de consulta
            </h2>

            <p>
              Filtra el historial por periodo,
              alumno, curso o tipo de evento.
            </p>

          </div>

        </div>


        <form
          className="
            admin-academic-events-filter-form
          "
          onSubmit={
            handleFilter
          }
        >

          <div
            className="
              admin-academic-events-field
            "
          >

            <label>
              Desde
            </label>

            <input
              type="date"
              value={from}
              onChange={
                event =>
                  setFrom(
                    event.target.value
                  )
              }
            />

          </div>


          <div
            className="
              admin-academic-events-field
            "
          >

            <label>
              Hasta
            </label>

            <input
              type="date"
              value={to}
              onChange={
                event =>
                  setTo(
                    event.target.value
                  )
              }
            />

          </div>


          <div
            className="
              admin-academic-events-field
            "
          >

            <label>
              Alumno
            </label>

            <input
              type="text"
              value={student}
              onChange={
                event =>
                  setStudent(
                    event.target.value
                  )
              }
              placeholder="Nombre, correo o UID"
              autoComplete="off"
            />

          </div>


          <div
            className="
              admin-academic-events-field
            "
          >

            <label>
              Curso
            </label>

            <select
              value={courseId}
              onChange={
                event =>
                  setCourseId(
                    event.target.value
                  )
              }
              disabled={
                loadingCourses
              }
            >

              <option value="">
                Todos los cursos
              </option>

              {courses.map(
                course => (

                  <option
                    key={
                      course.id
                    }
                    value={
                      course.id
                    }
                  >
                    {course.title}
                  </option>

                )
              )}

            </select>

          </div>


          <div
            className="
              admin-academic-events-field
            "
          >

            <label>
              Tipo de evento
            </label>

            <select
              value={eventType}
              onChange={
                event =>
                  setEventType(
                    event.target.value
                  )
              }
            >

              <option value="">
                Todos los eventos
              </option>

              {eventTypes.map(
                type => (

                  <option
                    key={
                      type
                    }
                    value={
                      type
                    }
                  >
                    {
                      EVENT_LABELS[
                        type
                      ]
                    }
                  </option>

                )
              )}

            </select>

          </div>


          <div
            className="
              admin-academic-events-filter-actions
            "
          >

            <button
              type="submit"
              className="
                admin-user-promote-button
              "
            >

              <i
                className="
                  bi bi-search
                "
              ></i>

              <span>
                Buscar
              </span>

            </button>


            <button
              type="button"
              className="
                admin-promotion-cancel-button
              "
              onClick={
                handleClear
              }
            >

              <i
                className="
                  bi bi-arrow-counterclockwise
                "
              ></i>

              <span>
                Limpiar
              </span>

            </button>

          </div>

        </form>

      </section>


      {/* ======================================================
          RESUMEN
          ====================================================== */}

      <section
        className="
          admin-academic-events-summary
        "
      >

        <div
          className="
            private-card
            admin-users-summary-card
          "
        >

          <div
            className="
              admin-users-summary-icon
            "
          >

            <i
              className="
                bi bi-clock-history
              "
            ></i>

          </div>


          <div
            className="
              admin-users-summary-content
            "
          >

            <span>
              Registros
            </span>

            <strong>
              {
                pagination.total
              }
            </strong>

            <small>
              Eventos encontrados
            </small>

          </div>

        </div>

      </section>


      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (

        <div
          className="
            admin-users-error
          "
          role="alert"
        >

          <i
            className="
              bi bi-exclamation-triangle
            "
          ></i>

          {error}

        </div>

      )}


      {/* ======================================================
          TABLA
          ====================================================== */}

      <section
        className="
          admin-users-panel
          animated-border
        "
      >

        <div
          className="
            private-card-header
          "
        >

          <div
            className="
              private-card-icon
            "
          >

            <i
              className="
                bi bi-clock-history
              "
            ></i>

          </div>


          <div>

            <h2>
              Actividad académica
            </h2>

            <p>
              Registro cronológico de eventos académicos.
            </p>

          </div>

        </div>


        {loading ? (

          <div
            className="
              admin-users-loading
            "
          >

            <i
              className="
                bi bi-hourglass-split
              "
            ></i>

            Cargando historial...

          </div>

        ) : events.length === 0 ? (

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
            >

              <i
                className="
                  bi bi-clock-history
                "
              ></i>

            </div>


            <h3>
              No hay eventos registrados
            </h3>


            <p>
              No existen registros que coincidan
              con los filtros seleccionados.
            </p>

          </div>

        ) : (

          <div
            className="
              admin-academic-events-table-wrapper
            "
          >

            <table
              className="
                admin-academic-events-table
              "
            >

              <thead>

                <tr>

                  <th>
                    Fecha
                  </th>

                  <th>
                    Alumno
                  </th>

                  <th>
                    Evento
                  </th>

                  <th>
                    Curso
                  </th>

                  <th>
                    Detalle
                  </th>

                </tr>

              </thead>


              <tbody>

                {events.map(
                  event => {

                    const studentName =
                      event.student?.name ||
                      event.student?.email ||
                      "Usuario";


                    const eventClass =
                      event.eventType
                        ?.toLowerCase()
                        .replaceAll(
                          "_",
                          "-"
                        ) ||
                      "unknown";


                    return (

                      <tr
                        key={
                          event.id
                        }
                      >

                        <td>

                          <span
                            className="
                              admin-users-date
                            "
                          >
                            {
                              formatDate(
                                event.createdAt
                              )
                            }
                          </span>

                        </td>


                        <td>

                          <div
                            className="
                              admin-users-user
                            "
                          >

                            <div
                              className="
                                admin-users-avatar
                              "
                            >

                              <i
                                className="
                                  bi bi-person
                                "
                              ></i>

                            </div>


                            <div
                              className="
                                admin-users-user-info
                              "
                            >

                              <strong>
                                {
                                  studentName
                                }
                              </strong>

                              <small>
                                {
                                  event.student?.email ||
                                  event.firebaseUid
                                }
                              </small>

                            </div>

                          </div>

                        </td>


                        <td>

                          <span
                            className={`
                              admin-academic-events-type
                              ${eventClass}
                            `}
                          >

                            <i
                              className={
                                EVENT_ICONS[
                                  event.eventType
                                ] ||
                                "bi bi-circle"
                              }
                            ></i>

                            {
                              EVENT_LABELS[
                                event.eventType
                              ] ||
                              event.eventType
                            }

                          </span>

                        </td>


                        <td>

                          <div
                            className="
                              admin-users-user-info
                            "
                          >

                            <strong>
                              {
                                event.course?.title ||
                                "Sin curso"
                              }
                            </strong>

                            <small>
                              {
                                event.courseId ||
                                "—"
                              }
                            </small>

                          </div>

                        </td>


                        <td>

                          <div
                            className="
                              admin-academic-events-detail
                            "
                          >

                            {event.certificateId && (

                              <span>
                                <i className="bi bi-patch-check"></i>
                                Constancia
                              </span>

                            )}


                            {event.examId && (

                              <span>
                                <i className="bi bi-clipboard-check"></i>
                                Examen
                              </span>

                            )}


                            {event.videoId && (

                              <span>
                                <i className="bi bi-play-circle"></i>
                                Video
                              </span>

                            )}


                            {!event.certificateId &&
                              !event.examId &&
                              !event.videoId && (

                                <span>
                                  <i className="bi bi-info-circle"></i>
                                  Evento académico
                                </span>

                              )}

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ======================================================
          PAGINACIÓN
          ====================================================== */}

      {pagination.totalPages > 0 && (

        <div
          className="
            admin-academic-events-pagination
          "
        >

          <button
            type="button"
            className="
              admin-user-promote-button
            "
            onClick={
              handlePrevious
            }
            disabled={
              page <= 1 ||
              loading
            }
          >

            <i
              className="
                bi bi-chevron-left
              "
            ></i>

            Anterior

          </button>


          <span>

            Página{" "}

            <strong>
              {
                pagination.page
              }
            </strong>

            {" "}de{" "}

            <strong>
              {
                pagination.totalPages
              }
            </strong>

          </span>


          <button
            type="button"
            className="
              admin-user-promote-button
            "
            onClick={
              handleNext
            }
            disabled={
              page >=
                pagination.totalPages ||
              loading
            }
          >

            Siguiente

            <i
              className="
                bi bi-chevron-right
              "
            ></i>

          </button>

        </div>

      )}

    </div>

  );

}


export default AdminAcademicEvents;