import {
  useState
} from "react";

import "../../styles/user/dashboardAcademicCourse.css";
import "../../styles/user/dashboardAcademicCourseExam.css";


function DashboardAcademicCourseExam({
  exam,
  assessment,
  unlocked,
  loading,
  onOpen
}) {

  const [
    showConfirmModal,
    setShowConfirmModal
  ] = useState(false);


  /* ============================================================
     ESTADO DE EVALUACIÓN
     ============================================================ */

  const attemptsCount =
    Number(
      assessment?.attemptsCount || 0
    );


  const passed =
    assessment?.passed === true;


  const score =
    assessment?.score;


  const completedAt =
    assessment?.completedAt;


  /* ============================================================
     ABRIR CONFIRMACIÓN
     ============================================================ */

  const handleOpenConfirmation =
    () => {

      if (
        !unlocked ||
        loading ||
        passed
      ) {

        return;

      }


      setShowConfirmModal(true);

    };


  /* ============================================================
     CERRAR CONFIRMACIÓN
     ============================================================ */

  const handleCloseConfirmation =
    () => {

      if (loading) {

        return;

      }


      setShowConfirmModal(false);

    };


  /* ============================================================
     CONFIRMAR EXAMEN
     ============================================================ */

  const handleConfirmExam =
    () => {

      setShowConfirmModal(false);

      onOpen();

    };


  /* ============================================================
     SIN EXAMEN
     ============================================================ */

  if (!exam) {

    return (

      <section
        className="
          academic-state-card
          animated-border
        "
      >

        <div className="academic-empty">

          <div className="academic-empty-icon">

            <i
              className="bi bi-file-earmark-x"
              aria-hidden="true"
            />

          </div>

          <strong>
            Examen final
          </strong>

          <span>
            Este curso todavía no tiene
            un examen configurado.
          </span>

        </div>

      </section>

    );

  }


  return (

    <>

      <section
        className={`
          academic-course-exam
          ${
            unlocked && !passed
              ? ""
              : "academic-course-exam-locked"
          }
          ${
            passed
              ? "approved"
              : unlocked
                ? "available"
                : "locked"
          }
          animated-border
        `}
      >

        <div
          className={`
            private-icon-button
            ${
              passed
                ? "private-icon-button-blue"
                : unlocked
                  ? "private-icon-button-blue"
                  : "private-icon-button-red"
            }
          `}
          aria-hidden="true"
        >

          <i
            className={
              passed
                ? "bi bi-check-circle-fill"
                : unlocked
                  ? "bi bi-file-earmark-check"
                  : "bi bi-lock"
            }
          />

        </div>


        <div className="academic-course-exam-content">

          <span className="private-page-eyebrow">
            Evaluación final
          </span>


          <h2>
            {
              exam.title ||
              "Examen final"
            }
          </h2>


          <p>
            {
              exam.description ||
              "Evaluación final del curso académico."
            }
          </p>


          {/* ====================================================
              APROBADO
              ==================================================== */}

          {passed ? (

            <>

              <div
                className="
                  academic-course-exam-status
                  available
                "
              >

                <i
                  className="bi bi-check-circle-fill"
                  aria-hidden="true"
                />

                <span>
                  Examen aprobado
                </span>

              </div>


              <div
                className="
                  academic-course-exam-result
                "
              >

                <div>

                  <span>
                    Calificación
                  </span>

                  <strong>
                    {
                      Number.isFinite(
                        Number(score)
                      )
                        ? Number(score).toFixed(2)
                        : "—"
                    }
                    {" / 10.00"}
                  </strong>

                </div>


                <div>

                  <span>
                    Intentos realizados
                  </span>

                  <strong>
                    {attemptsCount}
                  </strong>

                </div>

              </div>


              {completedAt && (

                <div
                  className="
                    academic-course-exam-approved-date
                  "
                >

                  <i
                    className="bi bi-calendar-check"
                    aria-hidden="true"
                  />

                  <span>
                    Aprobado el{" "}
                    {
                      new Date(
                        completedAt
                      ).toLocaleDateString(
                        "es-MX",
                        {
                          day:
                            "2-digit",

                          month:
                            "2-digit",

                          year:
                            "numeric"
                        }
                      )
                    }
                  </span>

                </div>

              )}

            </>

          ) : unlocked ? (

            /* ==================================================
               DISPONIBLE
               ================================================== */

            <>

              <div
                className="
                  academic-course-exam-status
                  available
                "
              >

                <i
                  className="bi bi-unlock-fill"
                  aria-hidden="true"
                />

                <span>
                  Examen disponible
                </span>

              </div>


              <div
                className="
                  academic-course-exam-attempts
                "
              >

                <i
                  className="bi bi-arrow-repeat"
                  aria-hidden="true"
                />

                <span>
                  Intentos realizados:
                </span>

                <strong>
                  {attemptsCount}
                </strong>

              </div>

            </>

          ) : (

            /* ==================================================
               BLOQUEADO
               ================================================== */

            <>

              <div
                className="
                  academic-course-exam-status
                  locked
                "
              >

                <i
                  className="bi bi-lock-fill"
                  aria-hidden="true"
                />

                <span>
                  Completa todos los videos
                  para desbloquear el examen.
                </span>

              </div>


              {attemptsCount > 0 && (

                <div
                  className="
                    academic-course-exam-attempts
                  "
                >

                  <i
                    className="bi bi-arrow-repeat"
                    aria-hidden="true"
                  />

                  <span>
                    Intentos realizados:
                  </span>

                  <strong>
                    {attemptsCount}
                  </strong>

                </div>

              )}

            </>

          )}

        </div>


        {/* ======================================================
            BOTÓN
            ====================================================== */}

        {!passed && (

          <button
            type="button"
            className="
              academic-course-button
              private-button
            "
            onClick={
              handleOpenConfirmation
            }
            disabled={
              !unlocked ||
              loading
            }
          >

            <i
              className={
                loading
                  ? "bi bi-arrow-repeat"
                  : unlocked
                    ? "bi bi-arrow-right"
                    : "bi bi-lock"
              }
              aria-hidden="true"
            />

            <span>
              {
                loading
                  ? "Preparando..."
                  : unlocked
                    ? "Presentar examen"
                    : "Examen bloqueado"
              }
            </span>

          </button>

        )}

      </section>


      {/* ========================================================
          MODAL DE CONFIRMACIÓN
          ======================================================== */}

      {showConfirmModal && (

        <div
          className="
            dashboard-course-structure-modal-overlay
            dashboard-course-exam-modal-overlay
          "
          role="presentation"
          onClick={
            handleCloseConfirmation
          }
        >

          <div
            className="
              dashboard-course-structure-modal
              dashboard-course-exam-modal-size
              animated-border
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="
              dashboard-course-exam-confirm-title
            "
            onClick={(event) => {
              event.stopPropagation();
            }}
          >

            <header
              className="
                dashboard-course-structure-modal-header
              "
            >

              <div>

                <span className="private-page-eyebrow">
                  Evaluación final
                </span>


                <h2
                  id="dashboard-course-exam-confirm-title"
                >
                  Iniciar examen
                </h2>


                <p>
                  {
                    exam.title ||
                    "Examen final"
                  }
                </p>

              </div>


              <button
                type="button"
                className="
                  private-icon-button
                  private-icon-button-red
                "
                onClick={
                  handleCloseConfirmation
                }
                disabled={
                  loading
                }
                aria-label="Cerrar confirmación"
              >

                <i
                  className="bi bi-x-lg"
                  aria-hidden="true"
                />

              </button>

            </header>


            <div
              className="
                dashboard-course-structure-modal-body
              "
            >

              <div className="academic-empty">

                <div
                  className="
                    private-icon-button
                    private-icon-button-blue
                  "
                  aria-hidden="true"
                >

                  <i
                    className="
                      bi bi-file-earmark-check
                    "
                    aria-hidden="true"
                  />

                </div>


                <strong>
                  ¿Deseas iniciar el examen?
                </strong>


                <span>
                  Al continuar se creará un nuevo
                  intento de evaluación.
                </span>


                <span>
                  Llevas{" "}
                  <strong>
                    {attemptsCount}
                  </strong>{" "}
                  {
                    attemptsCount === 1
                      ? "intento realizado."
                      : "intentos realizados."
                  }
                </span>

              </div>

            </div>


            <footer
              className="
                dashboard-course-structure-modal-footer
                academic-assessment-modal-footer

              "
            >

              <button
                type="button"
                className="
                  dashboard-course-structure-close-button
                "
                onClick={
                  handleCloseConfirmation
                }
                disabled={
                  loading
                }
              >

                <i
                  className="bi bi-x-lg"
                  aria-hidden="true"
                />

                <span>
                  Cancelar
                </span>

              </button>


              <button
                type="button"
                className="
                  academic-course-button
                  private-button
                "
                onClick={
                  handleConfirmExam
                }
                disabled={
                  loading
                }
              >

                <i
                  className={
                    loading
                      ? "bi bi-arrow-repeat"
                      : "bi bi-play-fill"
                  }
                  aria-hidden="true"
                />

                <span>
                  {
                    loading
                      ? "Preparando..."
                      : "Iniciar examen"
                  }
                </span>

              </button>

            </footer>

          </div>

        </div>

      )}

    </>

  );

}


export default DashboardAcademicCourseExam;