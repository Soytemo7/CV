import React from "react";

/**
 * ============================================================
 * ADMIN — TARJETA DE EXAMEN
 * ============================================================
 */

const ExamCard = ({
  course,
  exam,
  actionLoading,
  onNewExam,
  onEditExam,
  onManageQuestions,
}) => {
  const hasExam =
    Boolean(exam?.id);

  const questionCount =
    exam?.questions?.length || 0;

  return (
    <article
      className="
        admin-exams-card
        private-card
        animated-border
      "
    >
      {/* ======================================================
          ICONO
          ====================================================== */}

      <div
        className="
          admin-exams-card-icon
          private-icon-button
          private-icon-button-blue
        "
        aria-hidden="true"
      >
        <i className="bi bi-file-earmark-text" />
      </div>

      {/* ======================================================
          CONTENIDO
          ====================================================== */}

      <div className="admin-exams-card-content">
        <span className="admin-exams-card-course">
          {course?.title ||
            "Curso sin título"}
        </span>

        {hasExam ? (
          <>
            <h3>
              {exam.title}
            </h3>

            {exam.description && (
              <p>
                {exam.description}
              </p>
            )}

            <div className="admin-exams-card-meta">
              <span>
                <i className="bi bi-question-circle" />
                {questionCount}{" "}
                {questionCount === 1
                  ? "pregunta"
                  : "preguntas"}
              </span>

              <span className="admin-exams-status active">
                <i className="bi bi-check-circle" />
                Configurado
              </span>
            </div>

            <div className="admin-exams-card-actions">
              <button
                type="button"
                className="admin-users-view-button"
                onClick={() =>
                  onEditExam(exam)
                }
                disabled={
                  actionLoading
                }
                title="Editar examen"
              >
                <i className="bi bi-pencil-square" />
                Editar
              </button>

              <button
                type="button"
                className="admin-user-promote-button"
                onClick={() =>
                  onManageQuestions(
                    exam
                  )
                }
                disabled={
                  actionLoading
                }
                title="Configurar preguntas"
              >
                <i className="bi bi-list-check" />
                Preguntas
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>
              Sin examen
            </h3>

            <p>
              Este curso todavía no tiene
              un examen final configurado.
            </p>

            <div className="admin-exams-card-meta">
              <span>
                <i className="bi bi-dash-circle" />
                0 preguntas
              </span>

              <span className="admin-exams-status pending">
                <i className="bi bi-clock" />
                Pendiente
              </span>
            </div>

            <div className="admin-exams-card-actions">
              <button
                type="button"
                className="admin-user-promote-button"
                onClick={() =>
                  onNewExam(course)
                }
                disabled={
                  actionLoading
                }
              >
                <i className="bi bi-plus-circle" />
                Crear examen
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
};

export default ExamCard;