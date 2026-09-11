import React, {
  useEffect,
  useState,
} from "react";

/**
 * ============================================================
 * ADMIN — MODAL PREGUNTA
 * ============================================================
 */

const createEmptyOption = (
  order
) => ({
  text: "",
  order,
  isCorrect: false,
});

const QuestionModal = ({
  question,
  loading,
  onSave,
  onCancel,
}) => {
  const isEditing =
    Boolean(question?.id);

  const [questionText, setQuestionText] =
    useState("");

  const [order, setOrder] =
    useState(1);

  const [points, setPoints] =
    useState(1);

  const [options, setOptions] =
    useState([
      {
        text: "",
        order: 1,
        isCorrect: true,
      },
      {
        text: "",
        order: 2,
        isCorrect: false,
      },
    ]);

  const [formError, setFormError] =
    useState("");

  useEffect(() => {
    setQuestionText(
      question?.question || ""
    );

    setOrder(
      Number(
        question?.order || 1
      )
    );

    setPoints(
      Number(
        question?.points || 1
      )
    );

    setOptions(
      question?.options?.length
        ? question.options.map(
            (
              option,
              index
            ) => ({
              ...option,
              order:
                Number(
                  option.order
                ) ||
                index + 1,
              isCorrect:
                Boolean(
                  option.isCorrect
                ),
            })
          )
        : [
            {
              text: "",
              order: 1,
              isCorrect: true,
            },
            {
              text: "",
              order: 2,
              isCorrect: false,
            },
          ]
    );

    setFormError("");
  }, [question]);

  /* ==========================================================
     OPCIONES
     ========================================================== */

  const handleOptionChange = (
    index,
    value
  ) => {
    setOptions(
      (current) =>
        current.map(
          (
            option,
            optionIndex
          ) =>
            optionIndex === index
              ? {
                  ...option,
                  text: value,
                }
              : option
        )
    );
  };

  const handleCorrectChange = (
    index
  ) => {
    setOptions(
      (current) =>
        current.map(
          (
            option,
            optionIndex
          ) => ({
            ...option,
            isCorrect:
              optionIndex ===
              index,
          })
        )
    );
  };

  const handleAddOption = () => {
    setOptions(
      (current) => [
        ...current,
        createEmptyOption(
          current.length + 1
        ),
      ]
    );
  };

  const handleRemoveOption = (
    index
  ) => {
    if (options.length <= 2) {
      return;
    }

    const nextOptions =
      options
        .filter(
          (
            _,
            optionIndex
          ) =>
            optionIndex !==
            index
        )
        .map(
          (
            option,
            optionIndex
          ) => ({
            ...option,
            order:
              optionIndex + 1,
          })
        );

    /*
     * Si eliminamos la opción correcta,
     * asignamos la primera disponible.
     */
    if (
      !nextOptions.some(
        (option) =>
          option.isCorrect
      )
    ) {
      nextOptions[0].isCorrect =
        true;
    }

    setOptions(
      nextOptions
    );
  };

  /* ==========================================================
     VALIDACIÓN
     ========================================================== */

  const validate = () => {
    if (!questionText.trim()) {
      return "La pregunta es obligatoria.";
    }

    if (
      !Number.isInteger(
        Number(order)
      ) ||
      Number(order) < 1
    ) {
      return "El orden debe ser un entero mayor o igual a 1.";
    }

    if (
      !Number.isInteger(
        Number(points)
      ) ||
      Number(points) < 1 ||
      Number(points) > 10
    ) {
      return "Los puntos deben ser un número entero entre 1 y 10.";
    }

    if (options.length < 2) {
      return "Debes tener al menos dos opciones.";
    }

    if (
      options.some(
        (option) =>
          !option.text.trim()
      )
    ) {
      return "Todas las opciones deben tener texto.";
    }

    const correctCount =
      options.filter(
        (option) =>
          option.isCorrect
      ).length;

    if (correctCount !== 1) {
      return "Debes seleccionar exactamente una opción correcta.";
    }

    return "";
  };

  /* ==========================================================
     SUBMIT
     ========================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const validationError =
      validate();

    if (validationError) {
      setFormError(
        validationError
      );
      return;
    }

    setFormError("");

    await onSave({
      question:
        questionText.trim(),

      order:
        Number(order),

      points:
        Number(points),

      options:
        options.map(
          (
            option,
            index
          ) => ({
            text:
              option.text.trim(),

            order:
              index + 1,

            isCorrect:
              Boolean(
                option.isCorrect
              ),
          })
        ),
    });
  };

  return (
    <div
      className="
        admin-exams-modal-overlay
        admin-exams-question-overlay
      "
      role="presentation"
    >
      <div
        className="
          admin-exams-modal
          admin-exams-question-modal
          animated-border
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-question-modal-title"
      >
        {/* ==================================================
            HEADER
            ================================================== */}

        <header className="admin-exams-modal-header">
          <div>
            <span className="private-page-eyebrow">
              {isEditing
                ? "Editar pregunta"
                : "Nueva pregunta"}
            </span>

            <h2 id="admin-question-modal-title">
              {isEditing
                ? "Editar pregunta"
                : "Agregar pregunta"}
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
            FORM
            ================================================== */}

        <form
          className="admin-exams-form"
          onSubmit={handleSubmit}
        >
          {formError && (
            <div
              className="admin-exams-form-error"
              role="alert"
            >
              <i className="bi bi-exclamation-circle" />
              {formError}
            </div>
          )}

          {/* PREGUNTA */}

          <div className="admin-exams-field">
            <label htmlFor="question-text">
              Pregunta
            </label>

            <textarea
              id="question-text"
              value={questionText}
              onChange={(event) =>
                setQuestionText(
                  event.target.value
                )
              }
              placeholder="Escribe la pregunta..."
              rows={4}
              disabled={loading}
              autoFocus
            />
          </div>

          {/* ORDER + POINTS */}

          <div className="admin-exams-field-grid">
            <div className="admin-exams-field">
              <label htmlFor="question-order">
                Orden
              </label>

              <input
                id="question-order"
                type="number"
                min="1"
                step="1"
                value={order}
                onChange={(event) =>
                  setOrder(
                    event.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            <div className="admin-exams-field">
              <label htmlFor="question-points">
                Puntos
              </label>

              <input
                id="question-points"
                type="number"
                min="1"
                max="10"
                step="1"
                value={points}
                onChange={(event) =>
                  setPoints(
                    event.target.value
                  )
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* ==================================================
              OPCIONES
              ================================================== */}

          <div className="admin-exams-options-section">
            <div className="admin-exams-options-header">
              <div>
                <h3>
                  Opciones de respuesta
                </h3>

                <p>
                  Selecciona exactamente una
                  respuesta correcta.
                </p>
              </div>

              <button
                type="button"
                className="admin-users-view-button"
                onClick={
                  handleAddOption
                }
                disabled={loading}
              >
                <i className="bi bi-plus-lg" />
                Agregar opción
              </button>
            </div>

            <div className="admin-exams-edit-options">
              {options.map(
                (
                  option,
                  index
                ) => (
                  <div
                    key={
                      option.id ||
                      `new-option-${index}`
                    }
                    className={`
                      admin-exams-edit-option
                      ${
                        option.isCorrect
                          ? "correct"
                          : ""
                      }
                    `}
                  >
                    <button
                      type="button"
                      className={`
                        admin-exams-correct-button
                        ${
                          option.isCorrect
                            ? "selected"
                            : ""
                        }
                      `}
                      onClick={() =>
                        handleCorrectChange(
                          index
                        )
                      }
                      disabled={
                        loading
                      }
                      title={
                        option.isCorrect
                          ? "Respuesta correcta"
                          : "Marcar como correcta"
                      }
                      aria-label={
                        option.isCorrect
                          ? "Respuesta correcta"
                          : "Marcar como correcta"
                      }
                    >
                      <i
                        className={
                          option.isCorrect
                            ? "bi bi-check-circle-fill"
                            : "bi bi-circle"
                        }
                      />
                    </button>

                    <span className="admin-exams-option-index">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <input
                      type="text"
                      value={
                        option.text
                      }
                      onChange={(
                        event
                      ) =>
                        handleOptionChange(
                          index,
                          event.target.value
                        )
                      }
                      placeholder={`Opción ${
                        index + 1
                      }`}
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="admin-exams-option-delete"
                      onClick={() =>
                        handleRemoveOption(
                          index
                        )
                      }
                      disabled={
                        loading ||
                        options.length <=
                          2
                      }
                      title="Eliminar opción"
                      aria-label="Eliminar opción"
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                )
              )}
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
              type="submit"
              className="admin-promotion-confirm-button"
              disabled={loading}
            >
              <i
                className={
                  loading
                    ? "bi bi-hourglass-split"
                    : "bi bi-check-lg"
                }
              />

              {loading
                ? "Guardando..."
                : "Guardar pregunta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;