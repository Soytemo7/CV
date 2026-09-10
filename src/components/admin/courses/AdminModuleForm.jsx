import { useEffect, useState } from "react";

import {
  createModule,
  updateModule
} from "../../../services/admin/moduleService.js";

import {
  useNotification
} from "../../../hooks/useNotification.js";

import "../../../styles/admin/admin-users.css";
import "../../../styles/admin/admin-courses.css";
import "../../../styles/animated-border.css";
import "../../../styles/privateIconButton.css";

const AdminModuleForm = ({
  courseId,
  module,
  nextOrder,
  onSaved,
  onCancel
}) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const notification =
    useNotification();


  // ==========================================================
  // CARGAR DATOS PARA EDICIÓN
  // ==========================================================

  useEffect(() => {

    if (module) {

      setTitle(module.title || "");
      setDescription(module.description || "");
      setOrder(module.order ?? 0);

    } else {

      setTitle("");
      setDescription("");
      setOrder(nextOrder ?? 0);

    }

    setError("");

  }, [module, nextOrder]);


  // ==========================================================
  // GUARDAR
  // ==========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    if (!title.trim()) {

      setError(
        "El título del módulo es obligatorio."
      );

      return;

    }


    setLoading(true);

    try {

      let savedModule;


      if (module) {

        savedModule = await updateModule(
          module.id,
          {
            title: title.trim(),
            description: description.trim(),
            order: Number(order)
          }
        );

      } else {

        savedModule = await createModule({
          courseId,
          title: title.trim(),
          description: description.trim(),
          order: Number(order)
        });

      }


      onSaved(savedModule);

    } catch (err) {

      setError(
        err.message ||
        "No se pudo guardar el módulo."
      );

      notification.error({
        title: module
          ? "Error al actualizar el módulo"
          : "Error al crear el módulo",
        description:
          err.message ||
          "No fue posible guardar el módulo.",
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

      <form
        className="admin-promotion-modal animated-border"
        onSubmit={handleSubmit}
      >

        {/* ==================================================
            ICONO
            ================================================== */}

        <div
          className={`
            admin-promotion-modal-icon
            private-icon-button
            ${
              module
                ? "private-icon-button-purple"
                : "private-icon-button-blue"
            }
          `}
          aria-hidden="true"
        >

          <i
            className={
              module
                ? "bi bi-pencil-square"
                : "bi bi-folder-plus"
            }
          ></i>

        </div>


        {/* ==================================================
            TITULO
            ================================================== */}

        <div className="admin-promotion-modal-content">

          <h2>
            {module
              ? "Editar módulo"
              : "Nuevo módulo"}
          </h2>

          <p>
            {module
              ? "Actualiza la información del módulo académico."
              : "Agrega un nuevo módulo al curso."}
          </p>


          {/* ================================================
              TITULO
              ================================================ */}

          <label>
            Título del módulo

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              maxLength={200}
              disabled={loading}
              autoFocus
              placeholder="Ej. Introducción al curso"
            />

          </label>


          {/* ================================================
              DESCRIPCIÓN
              ================================================ */}

          <label>

            Descripción

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
              disabled={loading}
              placeholder="Descripción opcional del módulo."
            />

          </label>


          {/* ================================================
              ERROR
              ================================================ */}

          {error && (
            <p
              role="alert"
              style={{
                color: "#dc3545",
                marginTop: "0.75rem"
              }}
            >
              {error}
            </p>
          )}


          {/* ================================================
              ACCIONES
              ================================================ */}

          <div className="admin-promotion-modal-actions">

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
                : "Guardar módulo"}

            </button>

          </div>

        </div>

      </form>

    </div>
  );

};


export default AdminModuleForm;