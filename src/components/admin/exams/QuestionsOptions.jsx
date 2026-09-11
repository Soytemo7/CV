import React from "react";

/**
 * ============================================================
 * ADMIN — VISUALIZACIÓN DE OPCIONES
 * ============================================================
 *
 * El endpoint normal de alumno oculta isCorrect.
 * Este componente, por tanto, está preparado para mostrar
 * la indicación cuando el endpoint administrativo la entregue.
 *
 * Si la respuesta administrativa no incluye isCorrect,
 * simplemente muestra las opciones sin marcar ninguna.
 * ============================================================
 */

const QuestionOptions = ({
  options = [],
}) => {
  const sortedOptions =
    [...options].sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );

  return (
    <div className="admin-exams-options">
      {sortedOptions.map(
        (
          option,
          index
        ) => (
          <div
            key={
              option.id ||
              `option-${index}`
            }
            className={`
              admin-exams-option
              ${
                option.isCorrect
                  ? "correct"
                  : ""
              }
            `}
          >
            <span className="admin-exams-option-number">
              {String(
                option.order ??
                  index + 1
              ).padStart(2, "0")}
            </span>

            <span className="admin-exams-option-text">
              {option.text}
            </span>

            {option.isCorrect && (
              <span className="admin-exams-option-correct">
                <i className="bi bi-check-circle-fill" />
                Correcta
              </span>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default QuestionOptions;