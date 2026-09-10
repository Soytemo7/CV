import {
  useEffect,
  useState
} from "react";

import {
  getAdminEnrollmentDetail
} from "../../../services/admin/enrollmentAdminService.js";

import {
  useNotification
} from "../../../hooks/useNotification.js";

import "../../../styles/admin/admin-users.css";
import "../../../styles/admin/admin-courses.css";
import "../../../styles/admin/admin-courses2.css";
import "../../../styles/admin/admin-enrollments.css";
import "../../../styles/admin/admin-enrollment-detail.css";
import "../../../styles/animated-border.css";
import "../../../styles/privateIconButton.css";


const AdminEnrollmentDetail = ({
  enrollmentId,
  onClose
}) => {

  const notification =
    useNotification();

  const [enrollment, setEnrollment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  /*
   * ==========================================================
   * CARGAR DETALLE
   * ==========================================================
   */

  useEffect(() => {

    const loadDetail =
      async () => {

        setLoading(true);

        try {

          const response =
            await getAdminEnrollmentDetail(
              enrollmentId
            );

          const data =
            response?.enrollment ||
            response?.data ||
            response;

          setEnrollment(data);

        } catch (error) {

          notification.error({

            title:
              "Error al cargar inscripción",

            description:
              error.message ||
              "No fue posible obtener el detalle.",

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

          onClose();

        } finally {

          setLoading(false);

        }

      };


    loadDetail();

  }, [
    enrollmentId
  ]);


  /*
   * ==========================================================
   * ESCAPE
   * ==========================================================
   */

  useEffect(() => {

    const handleEscape =
      (event) => {

        if (
          event.key ===
          "Escape"
        ) {

          onClose();

        }

      };


    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, [
    onClose
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
            "medium",
          timeStyle:
            "short"
        }
      ).format(
        new Date(value)
      );

    };


  /*
   * ==========================================================
   * PROGRESO
   * ==========================================================
   */

  const getProgressClass =
    (percentage = 0) => {

      if (percentage >= 100) {
        return "is-complete";
      }

      if (percentage >= 75) {
        return "is-high";
      }

      if (percentage >= 50) {
        return "is-medium";
      }

      return "is-low";

    };


  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading) {

    return (

      <div
        className="admin-enrollment-detail-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Cargando detalle de inscripción"
      >

        <div
          className="
            admin-enrollment-detail-modal
            animated-border
          "
        >

          <div className="admin-enrollment-detail-loading">

            <div className="
              private-card-icon
              admin-enrollment-detail-loading-icon
            ">

              <i className="bi bi-hourglass-split"></i>

            </div>

            <h3>
              Cargando detalle
            </h3>

            <p>
              Obteniendo la información académica del alumno...
            </p>

          </div>

        </div>

      </div>

    );

  }


  if (!enrollment) {
    return null;
  }


  const percentage =
    enrollment.progress?.percentage || 0;

  const isCompleted =
    percentage >= 100;


  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (

    <div
      className="admin-enrollment-detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-enrollment-detail-title"
      onMouseDown={(event) => {

        if (
          event.target ===
          event.currentTarget
        ) {

          onClose();

        }

      }}
    >

      <div
        className="
          admin-enrollment-detail-modal
          animated-border
        "
      >


        {/* ====================================================
            HEADER
            ==================================================== */}

        <header className="admin-enrollment-detail-header">

          <div className="admin-enrollment-detail-header-main">

            <div className="
              private-card-icon
              admin-enrollment-detail-header-icon
            ">

              <i className="bi bi-person-check"></i>

            </div>

            <div>

              <span className="admin-enrollment-detail-eyebrow">
                SEGUIMIENTO ACADÉMICO
              </span>

              <h2 id="admin-enrollment-detail-title">
                Detalle de inscripción
              </h2>

              <p>
                Consulta detallada del progreso del alumno.
              </p>

            </div>

          </div>


          <button
            type="button"
            className="
              private-icon-button
              admin-enrollment-detail-close
            "
            onClick={onClose}
            aria-label="Cerrar detalle"
          >

            <i className="bi bi-x-lg"></i>

          </button>

        </header>


        {/* ====================================================
            CONTENIDO
            ==================================================== */}

        <div className="admin-enrollment-detail-content">


          {/* ==================================================
              ALUMNO
              ================================================== */}

          <section className="admin-enrollment-detail-student">

            <div className="admin-enrollment-detail-student-avatar">

              {enrollment.user?.photoURL ? (

                <img
                  src={
                    enrollment.user.photoURL
                  }
                  alt=""
                />

              ) : (

                <div className="private-card-icon">

                  <i className="bi bi-person"></i>

                </div>

              )}

            </div>


            <div className="admin-enrollment-detail-student-info">

              <span>
                ALUMNO
              </span>

              <h3>
                {enrollment.user?.name ||
                  "Usuario sin nombre"}
              </h3>

              <p>
                {enrollment.user?.email ||
                  enrollment.firebaseUid}
              </p>

              <small>
                <i className="bi bi-fingerprint"></i>
                UID: {enrollment.firebaseUid}
              </small>

            </div>


            <div
              className={`
                admin-enrollment-detail-status
                ${
                  isCompleted
                    ? "is-completed"
                    : "is-progress"
                }
              `}
            >

              <i
                className={
                  isCompleted
                    ? "bi bi-check-circle"
                    : "bi bi-hourglass-split"
                }
              ></i>

              {isCompleted
                ? "Completado"
                : "En progreso"}

            </div>


          </section>


          {/* ==================================================
              RESUMEN
              ================================================== */}

          <section className="admin-enrollment-detail-summary">


            <div className="admin-enrollment-detail-summary-item">

              <div className="
                private-card-icon
                admin-enrollment-detail-summary-icon
              ">

                <i className="bi bi-book"></i>

              </div>

              <div>

                <span>
                  CURSO
                </span>

                <strong>
                  {enrollment.course?.title ||
                    "Curso sin título"}
                </strong>

              </div>

            </div>


            <div className="admin-enrollment-detail-summary-item">

              <div className="
                private-card-icon
                admin-enrollment-detail-summary-icon
              ">

                <i className="bi bi-calendar3"></i>

              </div>

              <div>

                <span>
                  INSCRITO
                </span>

                <strong>
                  {formatDate(
                    enrollment.enrolledAt
                  )}
                </strong>

              </div>

            </div>


            <div className="admin-enrollment-detail-summary-item">

              <div className="
                private-card-icon
                admin-enrollment-detail-summary-icon
              ">

                <i className="bi bi-bar-chart"></i>

              </div>

              <div>

                <span>
                  PROGRESO
                </span>

                <strong>
                  {percentage}%
                </strong>

              </div>

            </div>


            <div className="admin-enrollment-detail-summary-item">

              <div className="
                private-card-icon
                admin-enrollment-detail-summary-icon
              ">

                <i className="bi bi-play-circle"></i>

              </div>

              <div>

                <span>
                  VIDEOS
                </span>

                <strong>
                  {enrollment.progress?.completedVideos || 0}
                  {" / "}
                  {enrollment.progress?.totalVideos || 0}
                </strong>

              </div>

            </div>


          </section>


          {/* ==================================================
              PROGRESO GENERAL
              ================================================== */}

          <section className="admin-enrollment-detail-progress-card">

            <div className="admin-enrollment-detail-progress-header">

              <div>

                <div className="admin-enrollment-detail-section-label">

                  <i className="bi bi-graph-up"></i>

                  <span>
                    PROGRESO GENERAL
                  </span>

                </div>

                <strong>
                  Avance académico
                </strong>

              </div>

              <b>
                {percentage}%
              </b>

            </div>


            <div className="admin-enrollment-detail-progress-track">

              <div
                className={`
                  admin-enrollment-detail-progress-fill
                  ${getProgressClass(percentage)}
                `}
                style={{
                  width: `${percentage}%`
                }}
              ></div>

            </div>


            <div className="admin-enrollment-detail-progress-footer">

              <span>
                {enrollment.progress?.completedVideos || 0}
                {" de "}
                {enrollment.progress?.totalVideos || 0}
                {" videos completados"}
              </span>

              {percentage >= 100 && (

                <span className="is-complete">

                  <i className="bi bi-check-circle"></i>

                  Curso completado

                </span>

              )}

            </div>

          </section>


          {/* ==================================================
              ESTRUCTURA ACADÉMICA
              ================================================== */}

          <section className="admin-enrollment-detail-section">

            <div className="admin-enrollment-detail-section-heading">

              <div className="
                private-card-icon
                admin-enrollment-detail-section-heading-icon
              ">

                <i className="bi bi-diagram-3"></i>

              </div>

              <div>

                <h3>
                  Estructura académica
                </h3>

                <p>
                  Progreso por módulo y lección.
                </p>

              </div>

            </div>


            <div className="admin-enrollment-detail-modules">

              {enrollment.modules?.map(
                module => (

                  <div
                    key={
                      module.id
                    }
                    className="admin-enrollment-detail-module"
                  >

                    <div className="admin-enrollment-detail-module-header">

                      <div>

                        <span>
                          MÓDULO {module.order}
                        </span>

                        <strong>
                          {module.title}
                        </strong>

                      </div>

                      <div className="admin-enrollment-detail-module-percentage">

                        <b>
                          {module.percentage}%
                        </b>

                      </div>

                    </div>


                    <div className="admin-enrollment-detail-module-track">

                      <div
                        className={`
                          admin-enrollment-detail-module-fill
                          ${getProgressClass(module.percentage || 0)}
                        `}
                        style={{
                          width: `${module.percentage || 0}%`
                        }}
                      ></div>

                    </div>


                    {module.lessons?.length > 0 && (

                      <div className="admin-enrollment-detail-lessons">

                        {module.lessons.map(
                          lesson => (

                            <div
                              key={
                                lesson.id
                              }
                              className="admin-enrollment-detail-lesson"
                            >

                              <div className="admin-enrollment-detail-lesson-main">

                                <div className="
                                  private-card-icon
                                  admin-enrollment-detail-lesson-icon
                                ">

                                  <i className="bi bi-play-circle"></i>

                                </div>

                                <div>

                                  <strong>
                                    {lesson.title}
                                  </strong>

                                  <span>

                                    {lesson.completedVideos}
                                    {" / "}
                                    {lesson.totalVideos}
                                    {" videos completados"}

                                  </span>

                                </div>

                              </div>


                              <div className="admin-enrollment-detail-lesson-progress">

                                <span>
                                  {lesson.percentage}%
                                </span>

                                <div>

                                  <div
                                    className={`
                                      ${getProgressClass(
                                        lesson.percentage || 0
                                      )}
                                    `}
                                    style={{
                                      width: `${lesson.percentage || 0}%`
                                    }}
                                  ></div>

                                </div>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          </section>


          {/* ==================================================
              EXAMEN
              ================================================== */}

          <section className="admin-enrollment-detail-section">

            <div className="admin-enrollment-detail-section-heading">

              <div className="
                private-card-icon
                admin-enrollment-detail-section-heading-icon
              ">

                <i className="bi bi-file-earmark-check"></i>

              </div>

              <div>

                <h3>
                  Examen
                </h3>

                <p>
                  Historial de intentos y resultados.
                </p>

              </div>

            </div>


            {enrollment.exam?.attempts?.length > 0 ? (

              <div className="admin-enrollment-detail-attempts">

                {enrollment.exam.attempts.map(
                  (attempt, index) => (

                    <div
                      key={
                        attempt.id
                      }
                      className="admin-enrollment-detail-attempt"
                    >

                      <div className="
                        private-card-icon
                        admin-enrollment-detail-attempt-icon
                      ">

                        <i className="bi bi-file-earmark-check"></i>

                      </div>


                      <div className="admin-enrollment-detail-attempt-info">

                        <strong>
                          Intento{" "}
                          {enrollment.exam.attempts.length - index}
                        </strong>

                        <span>
                          {formatDate(
                            attempt.completedAt ||
                            attempt.startedAt
                          )}
                        </span>

                      </div>


                      <div className="admin-enrollment-detail-attempt-score">

                        <strong>

                          {attempt.score !== null &&
                          attempt.score !== undefined
                            ? attempt.score.toFixed(2)
                            : "—"}

                        </strong>

                        <span>
                          Calificación
                        </span>

                      </div>


                      <span
                        className={`
                          admin-enrollment-detail-attempt-status
                          ${
                            attempt.passed
                              ? "is-approved"
                              : "is-rejected"
                          }
                        `}
                      >

                        <i
                          className={
                            attempt.passed
                              ? "bi bi-check-circle"
                              : "bi bi-x-circle"
                          }
                        ></i>

                        {attempt.passed
                          ? "Aprobado"
                          : "No aprobado"}

                      </span>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="admin-enrollment-detail-empty">

                <div className="private-card-icon">

                  <i className="bi bi-file-earmark-x"></i>

                </div>

                <span>
                  El alumno todavía no tiene intentos de examen.
                </span>

              </div>

            )}

          </section>


          {/* ==================================================
              CONSTANCIA
              ================================================== */}

          <section className="admin-enrollment-detail-section">

            <div className="admin-enrollment-detail-section-heading">

              <div className="
                private-card-icon
                admin-enrollment-detail-section-heading-icon
              ">

                <i className="bi bi-award"></i>

              </div>

              <div>

                <h3>
                  Constancia
                </h3>

                <p>
                  Información de certificación.
                </p>

              </div>

            </div>


            {enrollment.certificate ? (

              <div className="admin-enrollment-detail-certificate">

                <div className="
                  private-card-icon
                  admin-enrollment-detail-certificate-icon
                ">

                  <i className="bi bi-patch-check"></i>

                </div>

                <div className="admin-enrollment-detail-certificate-info">

                  <strong>
                    Constancia emitida
                  </strong>

                  <span>
                    {enrollment.certificate.certificateNumber}
                  </span>

                  <small>

                    <i className="bi bi-calendar-check"></i>

                    Emitida el{" "}

                    {formatDate(
                      enrollment.certificate.issuedAt
                    )}

                  </small>

                </div>

                <div className="admin-enrollment-detail-certificate-status">

                  <i className="bi bi-check-circle"></i>

                  Emitida

                </div>

              </div>

            ) : (

              <div className="admin-enrollment-detail-empty">

                <div className="private-card-icon">

                  <i className="bi bi-award"></i>

                </div>

                <span>
                  No existe una constancia emitida para esta inscripción.
                </span>

              </div>

            )}

          </section>


        </div>


        {/* ====================================================
            FOOTER
            ==================================================== */}

        <footer className="admin-enrollment-detail-footer">

          <div>

            <span>
              Inscripción:
            </span>

            <strong>
              {enrollment.id}
            </strong>

          </div>


          <button
            type="button"
            className="admin-users-view-button"
            onClick={onClose}
          >

            <i className="bi bi-x-lg"></i>

            Cerrar

          </button>

        </footer>


      </div>

    </div>

  );

};


export default AdminEnrollmentDetail;
