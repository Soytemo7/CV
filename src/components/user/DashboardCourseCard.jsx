import {
  useNavigate
} from "react-router-dom";

import {
  useState
} from "react";

import {
  getCourseById
} from "../../services/user/courseService.js";

import DashboardCourseStructureModal
  from "./DashboardCourseStructureModal.jsx";

import "../../styles/user/dashboardAcademicCourse.css";


function DashboardCourseCard({
  course,
  enrollment,
  enrolling,
  onEnroll
}) {

  const navigate =
    useNavigate();


  const [
    showEnrollModal,
    setShowEnrollModal
  ] = useState(false);


  const [
    showStructureModal,
    setShowStructureModal
  ] = useState(false);


  const [
    courseStructure,
    setCourseStructure
  ] = useState(null);


  const [
    loadingStructure,
    setLoadingStructure
  ] = useState(false);


  const [
    structureError,
    setStructureError
  ] = useState("");


  const status =
    enrollment?.status ||
    null;


  const isCompleted =
    status === "COMPLETADO";


  const isInProgress =
    status === "EN_PROGRESO";


  /* ==========================================================
     ABRIR CURSO
     ========================================================== */

  const handleOpenCourse = () => {

    navigate(
      `/dashboard/academic/courses/${course.id}`
    );

  };


  /* ==========================================================
     INSCRIPCIÓN
     ========================================================== */

  const handleEnroll = () => {

    if (enrolling) {
      return;
    }


    setShowEnrollModal(true);

  };


  const handleCancelEnroll = () => {

    if (enrolling) {
      return;
    }


    setShowEnrollModal(false);

  };


  const handleConfirmEnroll = async () => {

    if (enrolling) {
      return;
    }


    const enrollment =
      await onEnroll(
        course.id
      );


    if (enrollment) {

      setShowEnrollModal(
        false
      );

    }

  };


  /* ==========================================================
     ESTRUCTURA DEL CURSO
     ========================================================== */

  const handleOpenStructure = async () => {

    setShowStructureModal(true);

    setStructureError("");


    if (courseStructure) {
      return;
    }


    try {

      setLoadingStructure(true);


      const response =
        await getCourseById(
          course.id
        );


      const structure =
        response?.data ||
        response;


      setCourseStructure(
        structure
      );

    } catch (error) {

      setStructureError(
        error?.message ||
        "No fue posible obtener la estructura del curso."
      );

    } finally {

      setLoadingStructure(false);

    }

  };


  const handleCloseStructure = () => {

    if (loadingStructure) {
      return;
    }


    setShowStructureModal(false);

  };


  return (

    <>

      <article
        className={`dashboard-course-card ${
          !showEnrollModal && !showStructureModal
            ? "animated-border"
            : ""
        }`}
      >

        <div
          className="
            private-icon-button
            private-icon-button-blue
            dashboard-course-card-icon
          "
          aria-hidden="true"
        >

          <i
            className="bi bi-mortarboard"
            aria-hidden="true"
          ></i>

        </div>


        <div className="dashboard-course-card-content">

          <span className="dashboard-course-card-eyebrow">
            Curso académico
          </span>


          <h2>
            {course.title}
          </h2>


          <p>
            {course.description ||
              "Curso académico disponible."}
          </p>


          <div className="dashboard-course-card-meta">

            <span
              className={
                `dashboard-course-card-status ${
                  isCompleted
                    ? ""
                    : isInProgress
                      ? ""
                      : "available"
                }`
              }
            >

              <span
                className={
                  `dashboard-course-card-status-dot ${
                    isCompleted
                      ? "completed"
                      : isInProgress
                        ? "progress"
                        : "available"
                  }`
                }
              ></span>


              {isCompleted
                ? "Completado"
                : isInProgress
                  ? "En progreso"
                  : "Disponible"}

            </span>


            {course.createdAt && (

              <span>

                <i
                  className="bi bi-calendar3"
                  aria-hidden="true"
                ></i>

                {new Date(
                  course.createdAt
                ).toLocaleDateString(
                  "es-MX",
                  {
                    dateStyle: "medium"
                  }
                )}

              </span>

            )}

          </div>

        </div>


        <div className="dashboard-course-card-action">

          {/* ==================================================
             CURSO COMPLETADO
             ================================================== */}

          {isCompleted ? (

            <button
              type="button"
              className="user-dashboard-secondary-button"
              onClick={
                handleOpenCourse
              }
            >

              <i
                className="bi bi-check-circle"
                aria-hidden="true"
              ></i>


              <span>
                Curso completado
              </span>

            </button>

          ) : isInProgress ? (

            /* ==================================================
               CURSO EN PROGRESO
               ================================================== */

            <button
              type="button"
              className="user-dashboard-primary-button"
              onClick={
                handleOpenCourse
              }
            >

              <i
                className="bi bi-arrow-right"
                aria-hidden="true"
              ></i>


              <span>
                Continuar curso
              </span>

            </button>

          ) : (

            /* ==================================================
               CURSO DISPONIBLE
               ================================================== */

            <button
              type="button"
              className="user-dashboard-primary-button dashboard-course-card-enroll-button"
              onClick={
                handleEnroll
              }
              disabled={enrolling}
            >

              <i
                className={
                  enrolling
                    ? "bi bi-arrow-repeat"
                    : "bi bi-person-plus"
                }
                aria-hidden="true"
              ></i>


              <span>
                {enrolling
                  ? "Inscribiendo..."
                  : "Inscribirme"}
              </span>

            </button>

          )}


          {/* ==================================================
             VER ESTRUCTURA
             ================================================== */}

          <button
            type="button"
            className="dashboard-course-card-structure-button"
            onClick={
              handleOpenStructure
            }
          >

            <i
              className="bi bi-list-ul"
              aria-hidden="true"
            ></i>


            <span>
              Ver estructura
            </span>

          </button>

        </div>

      </article>


      {/* ======================================================
         MODAL — INSCRIPCIÓN
         ====================================================== */}

      {showEnrollModal && (

        <div
          className="dashboard-enroll-modal-overlay"
          role="presentation"
          onClick={
            handleCancelEnroll
          }
        >

          <div
            className="
              dashboard-enroll-modal
              animated-border
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-enroll-title"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >

            <header className="dashboard-enroll-modal-header">

              <div>

                <span className="private-page-eyebrow">
                  Configuración académica
                </span>


                <h2 id="dashboard-enroll-title">
                  Confirmar inscripción
                </h2>


                <p>
                  {course.title}
                </p>

              </div>


              <button
                type="button"
                className="dashboard-enroll-modal-close"
                onClick={
                  handleCancelEnroll
                }
                disabled={enrolling}
                aria-label="Cerrar confirmación"
              >

                <i
                  className="bi bi-x-lg"
                  aria-hidden="true"
                />

              </button>

            </header>


            <div className="dashboard-enroll-modal-body">

              <div className="dashboard-enroll-modal-info">

                <div className="dashboard-enroll-modal-info-icon">

                  <i
                    className="bi bi-person-plus"
                    aria-hidden="true"
                  />

                </div>


                <div>

                  <strong>
                    ¿Deseas inscribirte a este curso?
                  </strong>


                  <p>
                    Al confirmar, el curso quedará disponible
                    en tu área académica.
                  </p>

                </div>

              </div>

            </div>


            <footer className="dashboard-enroll-modal-footer">

              <button
                type="button"
                className="dashboard-enroll-modal-cancel"
                onClick={
                  handleCancelEnroll
                }
                disabled={enrolling}
              >

                <i
                  className="bi bi-arrow-left"
                  aria-hidden="true"
                />

                <span>
                  Cancelar
                </span>

              </button>


              <button
                type="button"
                className="dashboard-enroll-modal-confirm"
                onClick={
                  handleConfirmEnroll
                }
                disabled={enrolling}
              >

                <i
                  className={
                    enrolling
                      ? "bi bi-arrow-repeat"
                      : "bi bi-check-lg"
                  }
                  aria-hidden="true"
                />


                <span>
                  {enrolling
                    ? "Inscribiendo..."
                    : "Confirmar inscripción"}
                </span>

              </button>

            </footer>

          </div>

        </div>

      )}


      {/* ======================================================
         MODAL — ESTRUCTURA DEL CURSO
         ====================================================== */}

      {showStructureModal && (

        <DashboardCourseStructureModal
          course={course}
          courseStructure={courseStructure}
          loadingStructure={loadingStructure}
          structureError={structureError}
          onClose={handleCloseStructure}
        />

      )}

    </>

  );

}


export default DashboardCourseCard;