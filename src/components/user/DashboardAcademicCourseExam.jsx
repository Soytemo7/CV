import "../../styles/user/dashboardAcademicCourse.css";
function DashboardAcademicCourseExam({
  exam,
  unlocked,
  loading,
  onOpen
}) {

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
    <section
      className={`
        academic-course-exam
        ${unlocked
          ? ""
          : "academic-course-exam-locked"}
        ${unlocked
          ? "available"
          : "locked"}
        animated-border
      `}
    >

      {/* =====================================================
          ICONO
          ===================================================== */}

      <div
        className={`
          private-icon-button
          ${
            unlocked
              ? "private-icon-button-blue"
              : "private-icon-button-red"
          }
        `}
        aria-hidden="true"
      >

        <i
          className={
            unlocked
              ? "bi bi-file-earmark-check"
              : "bi bi-lock"
          }
        />

      </div>


      {/* =====================================================
          INFORMACIÓN
          ===================================================== */}

      <div className="academic-course-exam-content">

        <span className="private-page-eyebrow">
          Evaluación final
        </span>


        <h2>
          {exam.title ||
            "Examen final"}
        </h2>


        <p>
          {exam.description ||
            "Evaluación final del curso académico."}
        </p>


        {/* ===================================================
            ESTADO
            =================================================== */}

        <div
          className={`
            academic-course-exam-status
            ${
              unlocked
                ? "available"
                : "locked"
            }
          `}
        >

          {unlocked ? (

            <>
              <i
                className="bi bi-unlock-fill"
                aria-hidden="true"
              />

              <span>
                Examen disponible
              </span>
            </>

          ) : (

            <>
              <i
                className="bi bi-lock-fill"
                aria-hidden="true"
              />

              <span>
                Completa todos los videos
                para desbloquear el examen.
              </span>
            </>

          )}

        </div>

      </div>


      {/* =====================================================
          ACCIÓN
          ===================================================== */}

      <button
        type="button"
        className="
          academic-course-button
          private-button
        "
        onClick={onOpen}
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
          {loading
            ? "Preparando..."
            : unlocked
              ? "Presentar examen"
              : "Examen bloqueado"}
        </span>

      </button>

    </section>
  );
}


export default DashboardAcademicCourseExam;
