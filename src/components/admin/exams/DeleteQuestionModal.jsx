import React from "react";

/**
 * ============================================================
 * ADMIN — MODAL ELIMINAR PREGUNTA
 * ============================================================
 */

const DeleteQuestionModal = ({
  question,
  loading,
  onConfirm,
  onCancel,
}) => {
  if (!question) {
    return null;
  }

  return (
    <div
      className="admin-exams-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          if (!loading) {
            onCancel();
          }
        }
      }}
    >
      <div
        className="
          admin-exams-modal
          admin-exams-delete-modal
          animated-border
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-delete-question-title"
        aria-describedby="admin-delete-question-description"
      >
        {/* ==================================================
            HEADER
            ================================================== */}

        <header className="admin-exams-modal-header">
          <div>
            <span className="private-page-eyebrow">
              Administración académica
            </span>

            <h2 id="admin-delete-question-title">
              Eliminar pregunta
            </h2>
          </div>

          <button
            type="button"
            className="admin-exams-modal-close"
            onClick={onCancel}
            disabled={loading}
            aria-label="Cerrar"
          >
            <i className="bi bi-x-lg" />
          </button>
        </header>

        {/* ==================================================
            CONTENT
            ================================================== */}

        <div className="admin-exams-delete-content">

          <div className="admin-exams-delete-icon">
            <i className="bi bi-trash3" />
          </div>

          <div className="admin-exams-delete-message">

            <h3>
              ¿Deseas eliminar esta pregunta?
            </h3>

            <p id="admin-delete-question-description">
              Esta acción eliminará la pregunta y
              todas sus opciones de respuesta.
            </p>

          </div>

          <div className="admin-exams-delete-question">

            <span className="admin-exams-delete-question-label">
              Pregunta
            </span>

            <p>
              {question.question}
            </p>

          </div>

          <div className="admin-exams-delete-warning">
            <i className="bi bi-exclamation-triangle" />

            <span>
              Esta acción no se puede deshacer.
            </span>
          </div>

        </div>

        {/* ==================================================
            ACTIONS
            ================================================== */}

        <div className="admin-exams-modal-actions">

          <button
            type="button"
            className="admin-promotion-cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            <i className="bi bi-x-lg" />
            Cancelar
          </button>

          <button
            type="button"
            className="
              admin-promotion-confirm-button
              admin-exams-delete-confirm
            "
            onClick={onConfirm}
            disabled={loading}
          >
            <i
              className={
                loading
                  ? "bi bi-hourglass-split"
                  : "bi bi-trash3"
              }
            />

            {loading
              ? "Eliminando..."
              : "Eliminar pregunta"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteQuestionModal;