import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import NotificationContext
  from "../../../context/NotificationContext.jsx";

import {
  useNotification
} from "../../../hooks/useNotification.js";

import {
  getAdminCourses
} from "../../../services/admin/courseService.js";

import {
  getAdminEnrollments
} from "../../../services/admin/enrollmentAdminService.js";

import AdminEnrollmentDetail
  from "./AdminEnrollmentDetail.jsx";

import "../../../styles/admin/admin-users.css";
import "../../../styles/admin/admin-courses.css";
import "../../../styles/admin/admin-courses2.css";
import "../../../styles/animated-border.css";
import "../../../styles/privateIconButton.css";
import "../../../styles/admin/admin-enrollments.css";


const AdminEnrollments = () => {

  const notification =
    useNotification();

  const [courses, setCourses] =
    useState([]);

  const [enrollments, setEnrollments] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [courseId, setCourseId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedEnrollmentId, setSelectedEnrollmentId] =
    useState(null);


  /*
   * ==========================================================
   * CARGAR CURSOS
   * ==========================================================
   */

  useEffect(() => {

    const loadCourses =
      async () => {

        setLoadingCourses(true);

        try {

          const response =
            await getAdminCourses();


          const data =
            Array.isArray(response)
              ? response
              : response?.courses ||
                response?.data ||
                [];


          setCourses(data);

        } catch (err) {

          notification.error({

            title:
              "Error al cargar cursos",

            description:
              err.message ||
              "No fue posible obtener los cursos.",

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
              "welcome-notification"

          });

        } finally {

          setLoadingCourses(false);

        }

      };


    loadCourses();

  }, []);


  /*
   * ==========================================================
   * CARGAR INSCRIPCIONES
   * ==========================================================
   */

  useEffect(() => {

    const loadEnrollments =
      async () => {

        setLoading(true);
        setError("");

        try {

          const response =
            await getAdminEnrollments({
              search,
              courseId
            });


          const data =
            Array.isArray(response)
              ? response
              : response?.enrollments ||
                response?.data ||
                [];


          setEnrollments(data);

        } catch (err) {

          setError(
            err.message ||
            "No fue posible obtener las inscripciones."
          );

          notification.error({

            title:
              "Error al cargar inscripciones",

            description:
              err.message ||
              "No fue posible obtener las inscripciones.",

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
              "welcome-notification"

          });

        } finally {

          setLoading(false);

        }

      };


    const timeout =
      setTimeout(
        loadEnrollments,
        300
      );


    return () =>
      clearTimeout(timeout);

  }, [
    search,
    courseId
  ]);


  /*
   * ==========================================================
   * ESTADÍSTICAS
   * ==========================================================
   */

  const statistics =
    useMemo(() => {

      const total =
        enrollments.length;


      const completed =
        enrollments.filter(
          enrollment =>
            enrollment.status ===
            "COMPLETADO"
        ).length;


      const inProgress =
        enrollments.filter(
          enrollment =>
            enrollment.status ===
            "EN_PROGRESO"
        ).length;


      const certificates =
        enrollments.filter(
          enrollment =>
            Boolean(
              enrollment.certificate
            )
        ).length;


      return {

        total,

        completed,

        inProgress,

        certificates

      };

    }, [
      enrollments
    ]);


  /*
   * ==========================================================
   * FORMATO FECHA
   * ==========================================================
   */

  const formatDate =
    (value) => {

      if (!value) {
        return "—";
      }

      return new Intl.DateTimeFormat(
        "es-MX",
        {
          dateStyle:
            "medium"
        }
      ).format(
        new Date(value)
      );

    };


  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (

    <div className="admin-enrollments-container admin-users-header">


      {/* =====================================================
          ESTADÍSTICAS
          ===================================================== */}

      <div className="private-card admin-enrollments-stats">


        <div className="admin-enrollments-stat-card">

          <div className="private-card-icon">

            <i className="bi bi-people"></i>

          </div>

          <div>

            <span>
              Total
            </span>

            <strong>
              {statistics.total}
            </strong>

          </div>

        </div>


        <div className="admin-enrollments-stat-card">

          <div className="private-card-icon">

            <i className="bi bi-hourglass-split"></i>

          </div>

          <div>

            <span>
              En progreso
            </span>

            <strong>
              {statistics.inProgress}
            </strong>

          </div>

        </div>


        <div className="admin-enrollments-stat-card">

          <div className="private-card-icon">

            <i className="bi bi-check-circle"></i>

          </div>

          <div>

            <span>
              Completados
            </span>

            <strong>
              {statistics.completed}
            </strong>

          </div>

        </div>


        <div className="admin-enrollments-stat-card">

          <div className="private-card-icon">

            <i className="bi bi-award"></i>

          </div>

          <div>

            <span>
              Constancias
            </span>

            <strong>
              {statistics.certificates}
            </strong>

          </div>

        </div>


      </div>


      {/* =====================================================
          TARJETA PRINCIPAL
          ===================================================== */}

      <div className="private-card admin-enrollments-card">

        <div className="private-card-header">

          <div className="private-card-icon">

            <i className="bi bi-person-check"></i>

          </div>

          <div>

            <h2>
              Inscripciones
            </h2>

            <p>
              Consulta y seguimiento académico de los alumnos inscritos.
            </p>

          </div>

        </div>


        <div className="admin-enrollments-filters">

          <div className="admin-enrollments-search">

            <i
              className="bi bi-search"
              aria-hidden="true"
            ></i>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Buscar alumno, correo, UID o curso..."
              aria-label="Buscar inscripciones"
            />

          </div>


          <select
            value={courseId}
            onChange={(event) =>
              setCourseId(
                event.target.value
              )
            }
            disabled={
              loadingCourses
            }
            aria-label="Filtrar por curso"
          >

            <option value="">
              Todos los cursos
            </option>

            {courses.map(
              course => (

                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.title}
                </option>

              )
            )}

          </select>


          {(search || courseId) && (

            <button
              type="button"
              className="admin-users-view-button"
              onClick={() => {

                setSearch("");
                setCourseId("");

              }}
            >

              <i className="bi bi-x-circle"></i>

              Limpiar

            </button>

          )}

        </div>


        {error && (

          <div
            className="admin-enrollments-error"
            role="alert"
          >

            <i className="bi bi-exclamation-triangle"></i>

            {error}

          </div>

        )}


        <div className="admin-enrollments-table-wrapper">

          {loading ? (

            <div className="admin-enrollments-empty">

              <i className="bi bi-hourglass-split"></i>

              <p>
                Cargando inscripciones...
              </p>

            </div>

          ) : enrollments.length === 0 ? (

            <div className="admin-enrollments-empty">

              <i className="bi bi-person-x"></i>

              <h3>
                No hay inscripciones
              </h3>

              <p>
                No se encontraron inscripciones con los filtros actuales.
              </p>

            </div>

          ) : (

            <table className="admin-enrollments-table">

              <thead>

                <tr>

                  <th>
                    Alumno
                  </th>

                  <th>
                    Curso
                  </th>

                  <th>
                    Inscripción
                  </th>

                  <th>
                    Progreso
                  </th>

                  <th>
                    Examen
                  </th>

                  <th>
                    Constancia
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Detalle
                  </th>

                </tr>

              </thead>

              <tbody>

                {enrollments.map(
                  enrollment => {

                    const exam =
                      enrollment.exam
                        ?.latestAttempt;


                    return (

                      <tr
                        key={
                          enrollment.id
                        }
                      >

                        <td>

                          <div className="admin-enrollments-user">

                            {enrollment.user?.photoURL ? (

                              <img
                                src={
                                  enrollment.user.photoURL
                                }
                                alt=""
                                className="admin-enrollments-avatar"
                              />

                            ) : (

                              <div className="admin-enrollments-avatar-placeholder">

                                <i className="bi bi-person"></i>

                              </div>

                            )}

                            <div>

                              <strong>

                                {enrollment.user?.name ||
                                  "Usuario sin nombre"}

                              </strong>

                              <span>

                                {enrollment.user?.email ||
                                  enrollment.firebaseUid}

                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <strong>
                            {enrollment.course?.title ||
                              "Curso sin título"}
                          </strong>

                        </td>


                        <td>
                          {formatDate(
                            enrollment.enrolledAt
                          )}
                        </td>


                        <td>

                          <div className="admin-enrollments-progress">

                            <div className="admin-enrollments-progress-label">

                              <span>
                                {enrollment.progress?.completedVideos || 0}
                                /
                                {enrollment.progress?.totalVideos || 0}
                              </span>

                              <strong>
                                {enrollment.progress?.percentage || 0}%
                              </strong>

                            </div>

                          <div className="admin-enrollments-progress-track">

                            <div
                                className={`admin-enrollments-progress-fill ${
                                enrollment.progress?.percentage >= 100
                                    ? "is-complete"
                                    : enrollment.progress?.percentage >= 75
                                    ? "is-high"
                                    : enrollment.progress?.percentage >= 50
                                        ? "is-medium"
                                        : "is-low"
                                }`}
                                style={{
                                width: `${enrollment.progress?.percentage || 0}%`
                                }}
                            ></div>

                            </div>

                          </div>

                        </td>


                        <td>

                          {exam ? (

                            <div className="admin-enrollments-exam">

                              <strong>
                                {exam.score !== null &&
                                exam.score !== undefined
                                  ? exam.score.toFixed(2)
                                  : "Pendiente"}
                              </strong>

                              <span
                                className={
                                  exam.passed
                                    ? "is-approved"
                                    : "is-rejected"
                                }
                              >
                                {exam.passed
                                  ? "Aprobado"
                                  : "No aprobado"}
                              </span>

                            </div>

                          ) : (

                            <span className="admin-enrollments-muted">
                              Sin intento
                            </span>

                          )}

                        </td>


                        <td>

                          {enrollment.certificate ? (

                            <span className="admin-enrollments-badge is-certificate">

                              <i className="bi bi-award"></i>

                              Emitida

                            </span>

                          ) : (

                            <span className="admin-enrollments-muted">
                              No emitida
                            </span>

                          )}

                        </td>


                        <td>

                          <span
                            className={
                              enrollment.status ===
                              "COMPLETADO"
                                ? "admin-enrollments-badge is-completed"
                                : "admin-enrollments-badge is-progress"
                            }
                          >

                            <i
                              className={
                                enrollment.status ===
                                "COMPLETADO"
                                  ? "bi bi-check-circle"
                                  : "bi bi-hourglass-split"
                              }
                            ></i>

                            {enrollment.status ===
                            "COMPLETADO"
                              ? "Completado"
                              : "En progreso"}

                          </span>

                        </td>


                        <td>

                          <button
                            type="button"
                            className="private-icon-button private-icon-button-blue"
                            onClick={() =>
                              setSelectedEnrollmentId(
                                enrollment.id
                              )
                            }
                            aria-label={`Ver detalle de ${
                              enrollment.user?.name ||
                              "inscripción"
                            }`}
                          >

                            <i className="bi bi-eye"></i>

                          </button>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>


      {/* =====================================================
          DETALLE
          ===================================================== */}

      {selectedEnrollmentId && (

        <AdminEnrollmentDetail
          enrollmentId={
            selectedEnrollmentId
          }
          onClose={() =>
            setSelectedEnrollmentId(
              null
            )
          }
        />

      )}

    </div>

  );

};


export default AdminEnrollments;
