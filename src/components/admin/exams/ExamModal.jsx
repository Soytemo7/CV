import React, {
  useEffect,
  useState,
} from "react";

/**
 * ============================================================
 * ADMIN — MODAL EXAMEN
 * ============================================================
 */


const ExamModal = ({
  exam,
  courses,
  loading,
  onSave,
  onCancel,
}) => {
  const isEditing =
    Boolean(exam?.id);

  const [courseId, setCourseId] =
    useState(
      exam?.courseId || ""
    );

  const [title, setTitle] =
    useState(
      exam?.title || ""
    );

  const [description, setDescription] =
    useState(
      exam?.description || ""
    );

  const [formError, setFormError] =
    useState("");

  useEffect(() => {
    setCourseId(
      exam?.courseId || ""
    );

    setTitle(
      exam?.title || ""
    );

    setDescription(
      exam?.description || ""
    );

    setFormError("");
  }, [exam]);

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setFormError("");

    if (!isEditing && !courseId) {
      setFormError(
        "Selecciona un curso."
      );
      return;
    }

    if (!title.trim()) {
      setFormError(
        "El título del examen es obligatorio."
      );
      return;
    }

    await onSave({
      courseId,
      title: title.trim(),
      description:
        description.trim(),
    });
  };

  return (
    <div
      className="admin-exams-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onCancel();
        }
      }}
    >
      <div
        className="
          admin-exams-modal
          animated-border
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-exam-modal-title"
      >
        {/* ==================================================
            HEADER
            ================================================== */}

        <header className="admin-exams-modal-header">
          <div>
            <span className="private-page-eyebrow">
              {isEditing
                ? "Editar configuración"
                : "Nueva configuración"}
            </span>

            <h2 id="admin-exam-modal-title">
              {isEditing
                ? "Editar examen"
                : "Crear examen"}
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
            FORMULARIO
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

          {/* CURSO */}

          <div className="admin-exams-field">
            <label htmlFor="exam-course">
              Curso
            </label>

            {isEditing ? (
              <div className="admin-exams-readonly">
                <i className="bi bi-mortarboard" />

                <span>
                  {exam?.course?.title ||
                    courses.find(
                      (course) =>
                        course.id ===
                        courseId
                    )?.title ||
                    "Curso"}
                </span>
              </div>
            ) : (
              <select
                id="exam-course"
                value={courseId}
                onChange={(event) =>
                  setCourseId(
                    event.target.value
                  )
                }
                disabled={loading}
              >
                <option value="">
                  Seleccionar curso
                </option>

                {courses.map(
                  (course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.title}
                    </option>
                  )
                )}
              </select>
            )}
          </div>

          {/* TÍTULO */}

          <div className="admin-exams-field">
            <label htmlFor="exam-title">
              Título
            </label>

            <input
              id="exam-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Ej. Examen Final"
              maxLength={200}
              disabled={loading}
              autoFocus
            />
          </div>

          {/* DESCRIPCIÓN */}

          <div className="admin-exams-field">
            <label htmlFor="exam-description">
              Descripción
            </label>

            <textarea
              id="exam-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Describe brevemente el examen..."
              rows={5}
              maxLength={1000}
              disabled={loading}
            />
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
                : "Guardar examen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamModal;