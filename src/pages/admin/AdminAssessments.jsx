import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getAssessmentSummary,
  getAdminExams,
  getAdminAttempts,
  getAdminAttemptDetail,
} from "../../services/admin/assessmentService.js";

import "../../styles/admin/admin-users.css";
import "../../styles/admin/admin-courses.css";
import "../../styles/admin/admin-courses2.css";
import "../../styles/animated-border.css";
import "../../styles/privateIconButton.css";
import "../../styles/admin/admin-assessments.css";

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
};

const formatScore = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  return Number(value).toFixed(2);
};

const getStatusLabel = (
  attempt
) => {
  if (!attempt?.completedAt) {
    return "Pendiente";
  }

  return attempt.passed
    ? "Aprobado"
    : "No aprobado";
};

const getStatusClass = (
  attempt
) => {
  if (!attempt?.completedAt) {
    return "pending";
  }

  return attempt.passed
    ? "approved"
    : "failed";
};

const StatCard = ({
  icon,
  value,
  label,
  modifier = "",
}) => {
  return (
    <div
      className={`admin-assessments-stat-card ${modifier}`}
    >
      <div className="private-card-icon">
        <i
          className={`bi ${icon}`}
          aria-hidden="true"
        />
      </div>

      <div>
        <span>{label}</span>

        <strong>{value}</strong>
      </div>
    </div>
  );
};

const AdminAssessments =
  () => {
    const [
      activeTab,
      setActiveTab,
    ] = useState("exams");

    const [
      courseId,
      setCourseId,
    ] = useState("");

    const [
      status,
      setStatus,
    ] = useState("ALL");

    const [
      summary,
      setSummary,
    ] = useState(null);

    const [
      exams,
      setExams,
    ] = useState([]);

    const [
      attempts,
      setAttempts,
    ] = useState([]);

    const [
      loading,
      setLoading,
    ] = useState(true);

    const [
      error,
      setError,
    ] = useState("");

    const [
      detailLoading,
      setDetailLoading,
    ] = useState(false);

    const [
      selectedExam,
      setSelectedExam,
    ] = useState(null);

    const [
      selectedAttempt,
      setSelectedAttempt,
    ] = useState(null);

      const navigate =
      useNavigate();

    /**
     * ========================================================
     * CURSOS DISPONIBLES
     * ========================================================
     */
    const courses = useMemo(() => {
      const map =
        new Map();

      exams.forEach(
        (exam) => {
          if (
            exam.course?.id
          ) {
            map.set(
              exam.course.id,
              exam.course.title
            );
          }
        }
      );

      attempts.forEach(
        (attempt) => {
          if (
            attempt.course?.id
          ) {
            map.set(
              attempt.course.id,
              attempt.course.title
            );
          }
        }
      );

      return [
        ...map.entries(),
      ]
        .map(
          ([
            id,
            title,
          ]) => ({
            id,
            title,
          })
        )
        .sort(
          (a, b) =>
            a.title.localeCompare(
              b.title,
              "es-MX"
            )
        );
    }, [
      exams,
      attempts,
    ]);

    /**
     * ========================================================
     * CARGAR INFORMACIÓN
     * ========================================================
     */
    const loadData =
      useCallback(
        async () => {
          setLoading(true);
          setError("");

          try {
            const [
              summaryResponse,
              examsResponse,
              attemptsResponse,
            ] =
              await Promise.all([
                getAssessmentSummary(
                  courseId ||
                    undefined
                ),

                getAdminExams(
                  courseId ||
                    undefined
                ),

                getAdminAttempts({
                  courseId:
                    courseId ||
                    undefined,

                  status,
                }),
              ]);

            setSummary(
              summaryResponse?.summary ||
                {}
            );

            setExams(
              Array.isArray(
                examsResponse?.exams
              )
                ? examsResponse.exams
                : []
            );

            setAttempts(
              Array.isArray(
                attemptsResponse?.attempts
              )
                ? attemptsResponse.attempts
                : []
            );
          } catch (err) {
            console.error(
              "❌ Error cargando evaluaciones:",
              err
            );

            setError(
              err?.message ||
                "No fue posible cargar las evaluaciones."
            );
          } finally {
            setLoading(false);
          }
        },
        [
          courseId,
          status,
        ]
      );

    useEffect(() => {
      loadData();
    }, [loadData]);

    /**
     * ========================================================
     * VER EXAMEN
     * ========================================================
     */
    const handleViewExam = (
      exam
    ) => {
      setSelectedExam(exam);
    };

    /**
     * ========================================================
     * VER INTENTO
     * ========================================================
     */
    const handleViewAttempt =
      async (
        attempt
      ) => {
        setDetailLoading(
          true
        );

        setError("");

        try {
          const response =
            await getAdminAttemptDetail(
              attempt.id
            );

          setSelectedAttempt(
            response?.attempt ||
              null
          );
        } catch (err) {
          console.error(
            "❌ Error cargando intento:",
            err
          );

          setError(
            err?.message ||
              "No fue posible cargar el detalle."
          );
        } finally {
          setDetailLoading(
            false
          );
        }
      };

    /**
     * ========================================================
     * CERRAR MODALES
     * ========================================================
     */
    const closeExam = () => {
      setSelectedExam(
        null
      );
    };

    const closeAttempt =
      () => {
        if (
          detailLoading
        ) {
          return;
        }

        setSelectedAttempt(
          null
        );
      };

    return (
      <div className="admin-assessments-container admin-users-header">

         <header className="private-page-header">

          <button
            type="button"
            className="admin-users-view-button"
            onClick={() =>
              navigate("/admin")
            }
          >

            <i
              className="bi bi-arrow-left"
              aria-hidden="true"
            ></i>

            Volver al panel

          </button>


          <span className="private-page-eyebrow">
            Administración académica
          </span>

          <h1>
            Evaluaciones
          </h1>

          <p>
            Consulta y seguimiento de exámenes,
            intentos y resultados de los alumnos.
          </p>

        </header>


        {/* ==================================================
            ESTADÍSTICAS
            ================================================== */}

        <div className="private-card admin-assessments-stats">

          <StatCard
            icon="bi-journal-check"
            value={
              summary?.totalExams ??
              0
            }
            label="Exámenes"
          />

          <StatCard
            icon="bi-clipboard-data"
            value={
              summary?.totalAttempts ??
              0
            }
            label="Intentos"
          />

          <StatCard
            icon="bi-check-circle"
            value={
              summary?.passedAttempts ??
              0
            }
            label="Aprobados"
            modifier="approved"
          />

          <StatCard
            icon="bi-x-circle"
            value={
              summary?.failedAttempts ??
              0
            }
            label="No aprobados"
            modifier="failed"
          />

          <StatCard
            icon="bi-hourglass-split"
            value={
              summary?.pendingAttempts ??
              0
            }
            label="Pendientes"
            modifier="pending"
          />

          <StatCard
            icon="bi-bar-chart"
            value={formatScore(
              summary?.averageScore
            )}
            label="Promedio"
          />

        </div>

        {/* ==================================================
            CONTENIDO PRINCIPAL
            ================================================== */}

        <section
          className="private-card admin-assessments-content"
          aria-label="Administración de evaluaciones"
        >

          <div className="private-card-header">

            <div className="private-card-icon">
              <i className="bi bi-clipboard-check"></i>
            </div>

            <div>
              <h2>
                Evaluaciones
              </h2>

              <p>
                Consulta y seguimiento de exámenes, intentos y resultados de los alumnos.
              </p>
            </div>

          </div>

          {/* ==================================================
              FILTROS
              ================================================== */}

          <div className="admin-assessments-toolbar">

            <div className="admin-assessments-filter-group">

              <label htmlFor="assessment-course">
                Curso
              </label>

              <select
                id="assessment-course"
                value={courseId}
                onChange={(event) =>
                  setCourseId(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Todos los cursos
                </option>

                {courses.map(
                  (course) => (
                    <option
                      key={
                        course.id
                      }
                      value={
                        course.id
                      }
                    >
                      {
                        course.title
                      }
                    </option>
                  )
                )}
              </select>

            </div>

            <div className="admin-assessments-filter-group">

              <label htmlFor="assessment-status">
                Resultado
              </label>

              <select
                id="assessment-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >
                <option value="ALL">
                  Todos
                </option>

                <option value="PASSED">
                  Aprobados
                </option>

                <option value="FAILED">
                  No aprobados
                </option>

                <option value="PENDING">
                  Pendientes
                </option>
              </select>

            </div>

            <div className="admin-assessments-tabs">

              <button
                type="button"
                className={
                  activeTab ===
                  "exams"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "exams"
                  )
                }
              >
                <i className="bi bi-journal-check" />
                Exámenes
              </button>

              <button
                type="button"
                className={
                  activeTab ===
                  "attempts"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "attempts"
                  )
                }
              >
                <i className="bi bi-clipboard-data" />
                Resultados
              </button>

            </div>

          </div>

          {/* ==================================================
              ERROR
              ================================================== */}

          {error && (
            <div
              className="admin-users-error"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle" />

              {error}
            </div>
          )}

          {/* ==================================================
              LOADING
              ================================================== */}

          {loading ? (
            <div className="admin-users-loading">

              <i className="bi bi-hourglass-split" />

              Cargando evaluaciones...

            </div>
          ) : activeTab ===
            "exams" ? (

            /* =================================================
               EXÁMENES
               ================================================= */

            <section className="admin-assessments-panel">

              <div className="admin-users-results-header">

                <span className="admin-courses-results-count">

                  <i className="bi bi-journal-check" />

                  <strong>
                    {
                      exams.length
                    }
                  </strong>

                  <span>
                    {exams.length ===
                    1
                      ? "examen"
                      : "exámenes"}
                  </span>

                </span>

              </div>

              {exams.length ===
              0 ? (

                <div className="admin-users-empty animated-border">

                  <div className="admin-users-empty-icon">
                    <i className="bi bi-journal-x" />
                  </div>

                  <h3>
                    No hay exámenes
                    para mostrar
                  </h3>

                  <p>
                    No existen
                    exámenes
                    registrados
                    para los
                    criterios
                    actuales.
                  </p>

                </div>

              ) : (

                <div className="admin-users-table-wrapper">

                  <table className="admin-users-table admin-assessments-table">

                    <thead>
                      <tr>

                        <th>
                          Examen
                        </th>

                        <th>
                          Curso
                        </th>

                        <th>
                          Preguntas
                        </th>

                        <th>
                          Intentos
                        </th>

                        <th>
                          Registro
                        </th>

                        <th>
                          Acción
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {exams.map(
                        (exam) => (
                          <tr
                            key={
                              exam.id
                            }
                          >

                            <td>

                              <div className="admin-users-user">

                                <div className="admin-users-avatar">
                                  <i className="bi bi-journal-check" />
                                </div>

                                <div className="admin-users-user-info">

                                  <strong>
                                    {
                                      exam.title
                                    }
                                  </strong>

                                  <small>
                                    {
                                      exam.description ||
                                      "Sin descripción"
                                    }
                                  </small>

                                </div>

                              </div>

                            </td>

                            <td>

                              <span className="admin-assessments-course">
                                {
                                  exam
                                    .course
                                    ?.title
                                }
                              </span>

                            </td>

                            <td>

                              <span className="admin-assessments-number">
                                {
                                  exam
                                    ._count
                                    ?.questions ??
                                  0
                                }
                              </span>

                            </td>

                            <td>

                              <span className="admin-assessments-number">
                                {
                                  exam
                                    ._count
                                    ?.attempts ??
                                  0
                                }
                              </span>

                            </td>

                            <td>

                              <span className="admin-users-date">
                                {formatDate(
                                  exam.createdAt
                                )}
                              </span>

                            </td>

                            <td>

                              <button
                                type="button"
                                className="admin-users-view-button"
                                onClick={() =>
                                  handleViewExam(
                                    exam
                                  )
                                }
                              >
                                <i className="bi bi-eye" />

                                Ver examen
                              </button>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          ) : (

            /* =================================================
               RESULTADOS
               ================================================= */

            <section className="admin-assessments-panel">

              <div className="admin-users-results-header">

                <span className="admin-courses-results-count">

                  <i className="bi bi-clipboard-data" />

                  <strong>
                    {
                      attempts.length
                    }
                  </strong>

                  <span>
                    {attempts.length ===
                    1
                      ? "resultado"
                      : "resultados"}
                  </span>

                </span>

              </div>

              {attempts.length ===
              0 ? (

                <div className="admin-users-empty animated-border">

                  <div className="admin-users-empty-icon">
                    <i className="bi bi-clipboard-x" />
                  </div>

                  <h3>
                    No hay resultados
                    para mostrar
                  </h3>

                  <p>
                    No existen
                    intentos que
                    coincidan con
                    los filtros
                    actuales.
                  </p>

                </div>

              ) : (

                <div className="admin-users-table-wrapper">

                  <table className="admin-users-table admin-assessments-table">

                    <thead>
                      <tr>

                        <th>
                          Alumno
                        </th>

                        <th>
                          Curso
                        </th>

                        <th>
                          Examen
                        </th>

                        <th>
                          Fecha
                        </th>

                        <th>
                          Calificación
                        </th>

                        <th>
                          Resultado
                        </th>

                        <th>
                          Acción
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {attempts.map(
                        (
                          attempt
                        ) => (
                          <tr
                            key={
                              attempt.id
                            }
                          >

                            <td>

                              <div className="admin-users-user">

                                <div className="admin-users-avatar">
                                  <i className="bi bi-person" />
                                </div>

                                <div className="admin-users-user-info">

                                  <strong>
                                    {
                                      attempt
                                        .user
                                        ?.name ||
                                      "Alumno"
                                    }
                                  </strong>

                                  <small>
                                    {
                                      attempt
                                        .user
                                        ?.email ||
                                      attempt.firebaseUid
                                    }
                                  </small>

                                </div>

                              </div>

                            </td>

                            <td>
                              {
                                attempt
                                  .course
                                  ?.title
                              }
                            </td>

                            <td>
                              {
                                attempt
                                  .exam
                                  ?.title
                              }
                            </td>

                            <td>

                              <span className="admin-users-date">
                                {formatDate(
                                  attempt.completedAt ||
                                    attempt.startedAt
                                )}
                              </span>

                            </td>

                            <td>

                              <strong className="admin-assessments-score">
                                {formatScore(
                                  attempt.score
                                )}
                              </strong>

                            </td>

                            <td>

                              <span
                                className={`admin-assessments-result ${getStatusClass(
                                  attempt
                                )}`}
                              >

                                <i
                                  className={
                                    attempt.completedAt
                                      ? attempt.passed
                                        ? "bi bi-check-circle-fill"
                                        : "bi bi-x-circle-fill"
                                      : "bi bi-hourglass-split"
                                  }
                                />

                                {getStatusLabel(
                                  attempt
                                )}

                              </span>

                            </td>

                            <td>

                              <button
                                type="button"
                                className="admin-users-view-button"
                                onClick={() =>
                                  handleViewAttempt(
                                    attempt
                                  )
                                }
                              >
                                <i className="bi bi-eye" />

                                Detalle
                              </button>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          )}

        </section>

        {/* ======================================================
            MODAL — EXAMEN
            ====================================================== */}

        {selectedExam && (
          <div
            className="admin-promotion-modal-overlay"
            onClick={
              closeExam
            }
          >

            <div
              className="admin-promotion-modal admin-assessments-modal animated-border"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="admin-promotion-modal-icon private-icon-button private-icon-button-blue">

                <i className="bi bi-journal-check" />

              </div>

              <div className="admin-promotion-modal-content">

                <h2>
                  {
                    selectedExam.title
                  }
                </h2>

                <p>
                  {
                    selectedExam.description ||
                    "Examen final del curso."
                  }
                </p>

                <div className="admin-assessments-modal-meta">

                  <span>

                    <i className="bi bi-mortarboard" />

                    {
                      selectedExam
                        .course
                        ?.title ||
                      "Sin curso"
                    }

                  </span>

                  <span>

                    <i className="bi bi-list-ol" />

                    {
                      selectedExam
                        .questions
                        ?.length ||
                      0
                    }{" "}
                    preguntas

                  </span>

                </div>

                <div className="admin-assessments-question-list">

                  {selectedExam.questions?.map(
                    (
                      question
                    ) => (
                      <article
                        key={
                          question.id
                        }
                        className="admin-assessments-question animated-border"
                      >

                        <div className="admin-assessments-question-heading">

                          <span>
                            {String(
                              question.order
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <strong>
                            {
                              question.question
                            }
                          </strong>

                          <small>
                            {
                              question.points
                            }{" "}
                            pts.
                          </small>

                        </div>

                        <div className="admin-assessments-options">

                          {question.options?.map(
                            (
                              option
                            ) => (
                              <div
                                key={
                                  option.id
                                }
                                className={
                                  option.isCorrect
                                    ? "correct"
                                    : ""
                                }
                              >

                                <i
                                  className={
                                    option.isCorrect
                                      ? "bi bi-check-circle-fill"
                                      : "bi bi-circle"
                                  }
                                />

                                <span>
                                  {
                                    option.text
                                  }
                                </span>

                                {option.isCorrect && (
                                  <small>
                                    Correcta
                                  </small>
                                )}

                              </div>
                            )
                          )}

                        </div>

                      </article>
                    )
                  )}

                </div>

                <div className="admin-courses-modal-actions">

                  <button
                    type="button"
                    className="admin-promotion-cancel-button"
                    onClick={
                      closeExam
                    }
                  >
                    <i className="bi bi-x-lg" />

                    Cerrar
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================================
            MODAL — DETALLE DE RESULTADO
            ====================================================== */}

        {selectedAttempt && (
          <div
            className="admin-promotion-modal-overlay"
            onClick={
              closeAttempt
            }
          >

            <div
              className="admin-promotion-modal admin-assessments-modal animated-border"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div
                className={`admin-promotion-modal-icon private-icon-button ${
                  selectedAttempt.passed
                    ? "private-icon-button-green"
                    : "private-icon-button-red"
                }`}
              >

                <i
                  className={
                    selectedAttempt.passed
                      ? "bi bi-check-circle"
                      : "bi bi-clipboard-data"
                  }
                />

              </div>

              <div className="admin-promotion-modal-content">

                <h2>
                  Detalle del
                  resultado
                </h2>

                <p>
                  {
                    selectedAttempt
                      .user
                      ?.name ||
                    "Alumno"
                  }{" "}
                  ·{" "}
                  {
                    selectedAttempt
                      .exam
                      ?.title ||
                    "Examen"
                  }
                </p>

                <div className="admin-assessments-result-summary">

                  <div>

                    <span>
                      Curso
                    </span>

                    <strong>
                      {
                        selectedAttempt
                          .course
                          ?.title
                      }
                    </strong>

                  </div>

                  <div>

                    <span>
                      Calificación
                    </span>

                    <strong>
                      {formatScore(
                        selectedAttempt.score
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Resultado
                    </span>

                    <strong
                      className={
                        selectedAttempt.passed
                          ? "is-approved"
                          : "is-failed"
                      }
                    >
                      {
                        selectedAttempt.passed
                          ? "Aprobado"
                          : "No aprobado"
                      }
                    </strong>

                  </div>

                  <div>

                    <span>
                      Inicio
                    </span>

                    <strong>
                      {formatDate(
                        selectedAttempt.startedAt
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Entrega
                    </span>

                    <strong>
                      {formatDate(
                        selectedAttempt.completedAt
                      )}
                    </strong>

                  </div>

                </div>

                <div className="admin-assessments-question-list">

                  {selectedAttempt.questions?.map(
                    (
                      question
                    ) => (
                      <article
                        key={
                          question.id
                        }
                        className="admin-assessments-question animated-border"
                      >

                        <div className="admin-assessments-question-heading">

                          <span>
                            {String(
                              question.order
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <strong>
                            {
                              question.question
                            }
                          </strong>

                          <small>
                            {
                              question.answer
                                ?.pointsObtained ??
                              0
                            }{" "}
                            /{" "}
                            {
                              question.points
                            }{" "}
                            pts.
                          </small>

                        </div>

                        <div className="admin-assessments-answer-detail">

                          <div
                            className={
                              question
                                .answer
                                ?.isCorrect
                                ? "answer correct"
                                : "answer incorrect"
                            }
                          >

                            <span>
                              Respuesta
                              del
                              alumno
                            </span>

                            <strong>
                              {
                                question
                                  .answer
                                  ?.selectedOption
                                  ?.text ||
                                "Sin respuesta"
                              }
                            </strong>

                          </div>

                          <div className="answer correct-reference">

                            <span>
                              Respuesta
                              correcta
                            </span>

                            <strong>
                              {
                                question
                                  .correctOption
                                  ?.text ||
                                "No disponible"
                              }
                            </strong>

                          </div>

                        </div>

                      </article>
                    )
                  )}

                </div>

                <div className="admin-courses-modal-actions">

                  <button
                    type="button"
                    className="admin-promotion-cancel-button"
                    onClick={
                      closeAttempt
                    }
                  >
                    <i className="bi bi-x-lg" />

                    Cerrar
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================================
            LOADING DETALLE
            ====================================================== */}

        {detailLoading && (
          <div className="admin-assessments-loading-overlay">

            <div className="admin-assessments-loading-card animated-border">

              <i className="bi bi-hourglass-split" />

              <span>
                Cargando detalle...
              </span>

            </div>

          </div>
        )}

      </div>
    );
  };

export default AdminAssessments;