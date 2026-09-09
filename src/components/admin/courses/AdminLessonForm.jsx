import { useEffect, useState } from "react";

import {
  createLesson,
  updateLesson
} from "../../../services/admin/lessonService.js";

import {
  useNotification
} from "../../../hooks/useNotification.js";

import "../../../styles/admin/admin-users.css";
import "../../../styles/admin/admin-courses.css";
import "../../../styles/animated-border.css";
import "../../../styles/privateIconButton.css";


const AdminLessonForm = ({
  moduleId,
  lesson,
  nextOrder,
  onSaved,
  onCancel
}) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const notification =
    useNotification();


  // ==========================================================
  // CARGAR DATOS EN EDICIÓN
  // ==========================================================

  useEffect(() => {

    if (lesson) {

      setTitle(
        lesson.title || ""
      );

      setDescription(
        lesson.description || ""
      );

    } else {

      setTitle("");
      setDescription("");

    }

    setError("");

  }, [lesson]);


  // ==========================================================
  // GUARDAR
  // ==========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!title.trim()) {

      setError(
        "El título de la lección es obligatorio."
      );

      return;

    }

    setLoading(true);
    setError("");

    try {

      if (lesson) {

        await updateLesson(
          lesson.id,
          {
            title: title.trim(),
            description: description.trim()
          }
        );

      } else {

        await createLesson({
          moduleId,
          title: title.trim(),
          description: description.trim(),
          order: nextOrder
        });

      }

      await onSaved();

    } catch (err) {

      setError(
        err.message ||
        "No se pudo guardar la lección."
      );

      notification.error({
        title: lesson
          ? "Error al actualizar la lección"
          : "Error al crear la lección",
        description:
          err.message ||
          "No fue posible guardar la lección.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="admin-promotion-modal-overlay">

      <div
        className="
          admin-promotion-modal
          animated-border
          admin-courses-delete-modal
        "
      >

        <div
          className="
            admin-promotion-modal-icon
            private-icon-button
            private-icon-button-blue
          "
          aria-hidden="true"
        >
          <i className="bi bi-list-ul"></i>
        </div>


        <div className="admin-promotion-modal-content">

          <h2>
            {lesson
              ? "Editar lección"
              : "Nueva lección"}
          </h2>


          {error && (
            <div
              className="admin-users-error"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle"></i>
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="admin-users-form-group">

              <label htmlFor="lesson-title">
                Título
              </label>

              <input
                id="lesson-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Título de la lección"
                disabled={loading}
                maxLength={200}
                autoFocus
              />

            </div>


            <div className="admin-users-form-group">

              <label htmlFor="lesson-description">
                Descripción
              </label>

              <textarea
                id="lesson-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Descripción de la lección"
                disabled={loading}
                rows={4}
              />

            </div>


            <div className="admin-courses-modal-actions">

              <button
                type="button"
                className="admin-promotion-cancel-button"
                onClick={onCancel}
                disabled={loading}
              >
                <i className="bi bi-x-lg"></i>
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
                ></i>

                {loading
                  ? "Guardando..."
                  : lesson
                    ? "Guardar cambios"
                    : "Crear lección"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );

};


export default AdminLessonForm;
