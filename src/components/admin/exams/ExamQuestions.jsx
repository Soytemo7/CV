import React from "react";

import QuestionOptions from "./QuestionsOptions";

/**
 * ============================================================
 * ADMIN — CONFIGURACIÓN DE PREGUNTAS
 * ============================================================
 */

const ExamQuestions = ({
  exam,
  loading,
  onNewQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onClose,
}) => {
  const questions =
    [...(exam.questions || [])].sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );

  return (
    <div
      className="admin-exams-modal-overlay"
      role="presentation"
    >
      <div
        className="
          admin-exams-questions-modal
          animated-border
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-questions-title"
      >
        {/* ==================================================
            HEADER
            ================================================== */}

        <header className="admin-exams-modal-header">
          <div>
            <span className="private-page-eyebrow">
              Configuración académica
            </span>

            <h2 id="admin-questions-title">
              {exam.title}
            </h2>

            <p>
              {exam.course?.title ||
                "Curso académico"}
            </p>
          </div>

          <button
            type="button"
            className="admin-exams-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar configuración"
          >
            <i className="bi bi-x-lg" />
          </button>
        </header>

        {/* ==================================================
            TOOLBAR
            ================================================== */}

        <div className="admin-exams-questions-toolbar">
          <div>
            <strong>
              Preguntas
            </strong>

            <span>
              {questions.length}{" "}
              {questions.length === 1
                ? "pregunta"
                : "preguntas"}
            </span>
          </div>

          <button
            type="button"
            className="admin-user-promote-button"
            onClick={onNewQuestion}
            disabled={loading}
          >
            <i className="bi bi-plus-lg" />
            Nueva pregunta
          </button>
        </div>

        {/* ==================================================
            LISTA
            ================================================== */}

        {questions.length === 0 ? (
          <div
            className="
              admin-exams-questions-empty
              private-card
            "
          >
            <div
              className="
                admin-exams-empty-icon
                private-icon-button
                private-icon-button-blue
              "
            >
              <i className="bi bi-question-circle" />
            </div>

            <h3>
              Este examen todavía no tiene preguntas
            </h3>

            <p>
              Agrega la primera pregunta para
              comenzar a estructurar la evaluación.
            </p>

            <button
              type="button"
              className="admin-user-promote-button"
              onClick={onNewQuestion}
              disabled={loading}
            >
              <i className="bi bi-plus-circle" />
              Crear primera pregunta
            </button>
          </div>
        ) : (
          <div className="admin-exams-questions-list">
            {questions.map(
              (
                question,
                index
              ) => (
                <article
                  key={question.id}
                  className="
                    admin-exams-question-card
                    private-card
                  "
                >
                  {/* NUMBER */}

                  <div className="admin-exams-question-number">
                    {String(
                      question.order ??
                        index + 1
                    ).padStart(2, "0")}
                  </div>

                  {/* CONTENT */}

                  <div className="admin-exams-question-content">
                    <div className="admin-exams-question-header">
                      <div>
                        <h3>
                          {question.question}
                        </h3>

                        <div className="admin-exams-question-meta">
                          <span>
                            <i className="bi bi-star" />
                            {question.points}{" "}
                            {Number(
                              question.points
                            ) === 1
                              ? "punto"
                              : "puntos"}
                          </span>

                          <span>
                            <i className="bi bi-list-check" />
                            {question.options?.length ||
                              0}{" "}
                            opciones
                          </span>
                        </div>
                      </div>

                      <div className="admin-exams-question-actions">
                        <button
                          type="button"
                          className="admin-users-view-button"
                          onClick={() =>
                            onEditQuestion(
                              question
                            )
                          }
                          disabled={loading}
                          title="Editar pregunta"
                          aria-label="Editar pregunta"
                        >
                          <i className="bi bi-pencil-square" />
                        </button>

                        <button
                          type="button"
                          className="admin-promotion-cancel-button"
                          onClick={() =>
                            onDeleteQuestion(
                              question
                            )
                          }
                          disabled={loading}
                          title="Eliminar pregunta"
                          aria-label="Eliminar pregunta"
                        >
                          <i className="bi bi-trash3" />
                        </button>
                      </div>
                    </div>

                    <QuestionOptions
                      options={
                        question.options ||
                        []
                      }
                    />
                  </div>
                </article>
              )
            )}
          </div>
        )}

        {/* ==================================================
            FOOTER
            ================================================== */}

        <footer className="admin-exams-questions-footer">
          <button
            type="button"
            className="admin-promotion-cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            <i className="bi bi-arrow-left" />
            Volver a exámenes
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ExamQuestions;