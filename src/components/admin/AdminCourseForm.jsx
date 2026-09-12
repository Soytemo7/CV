/* ============================================================
   ADMIN COURSE FORM
   Formulario de creación y edición de cursos.
   ============================================================ */

import {
  useEffect,
  useState
} from "react";

import "../../styles/privateIconButton.css";


function AdminCourseForm({
  course,
  onSubmit,
  onCancel,
  loading
}) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: ""
  });


  /* ============================================================
     CARGAR DATOS
     ============================================================ */

  useEffect(() => {

    setForm({
      title:
        course?.title || "",

      description:
        course?.description || "",

      imageUrl:
        course?.imageUrl || ""
    });

  }, [course]);


  /* ============================================================
     CAMBIAR CAMPO
     ============================================================ */

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));

  };


  /* ============================================================
     ENVIAR
     ============================================================ */

  const handleSubmit = async (event) => {

    event.preventDefault();

    await onSubmit({
      title:
        form.title.trim(),

      description:
        form.description.trim(),

      imageUrl:
        form.imageUrl.trim()
    });

  };


  /* ============================================================
     RENDER
     ============================================================ */

  return (

    <div className="admin-promotion-modal-overlay">

      <div
        className="admin-promotion-modal animated-border"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-course-form-title"
      >

        <div
          className={`
            admin-promotion-modal-icon
            private-icon-button
            ${
              course
                ? "private-icon-button-purple"
                : "private-icon-button-blue"
            }
          `}
          aria-hidden="true"
        >

          <i
            className={
              course
                ? "bi bi-pencil-square"
                : "bi bi-journal-plus"
            }
          ></i>

        </div>


        <div className="admin-promotion-modal-content">

          <span className="admin-promotion-modal-eyebrow">
            Administración académica
          </span>

          <h3 id="admin-course-form-title">

            {course
              ? "Editar curso"
              : "Nuevo curso"}

          </h3>


          <p>

            {course
              ? "Modifica la información del curso."
              : "Crea un nuevo curso académico."}

          </p>


          <form
            onSubmit={handleSubmit}
          >

            {/* ==================================================
                TÍTULO
                ================================================== */}

            <div className="admin-users-filter">

              <label htmlFor="course-title">
                Título
              </label>

              <input
                id="course-title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={200}
                disabled={loading}
                autoFocus
              />

            </div>


            {/* ==================================================
                DESCRIPCIÓN
                ================================================== */}

            <div
              className="admin-users-filter"
              style={{
                marginTop: "1rem"
              }}
            >

              <label htmlFor="course-description">
                Descripción
              </label>

              <textarea
                id="course-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                maxLength={2000}
                disabled={loading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px",
                  border: "1px solid rgba(128, 128, 128, 0.25)",
                  borderRadius: "8px",
                  outline: "none",
                  background: "transparent",
                  color: "inherit",
                  font: "inherit",
                  resize: "vertical"
                }}
              />

            </div>


            {/* ==================================================
                IMAGEN DEL CURSO
                ================================================== */}

            <div
              className="admin-users-filter"
              style={{
                marginTop: "1rem"
              }}
            >

              <label htmlFor="course-image-url">
                URL de imagen
              </label>

              <input
                id="course-image-url"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                maxLength={2000}
                disabled={loading}
                placeholder="https://ejemplo.com/imagen.jpg"
              />

            </div>


            {/* ==================================================
                ACCIONES
                ================================================== */}

            <div className="admin-promotion-modal-actions">

              <button
                type="button"
                className="admin-promotion-cancel-button"
                onClick={onCancel}
                disabled={loading}
              >

                Cancelar

              </button>


              <button
                type="submit"
                className="admin-promotion-confirm-button"
                disabled={
                  loading ||
                  !form.title.trim()
                }
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
                  : course
                    ? "Guardar cambios"
                    : "Crear curso"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

}


export default AdminCourseForm;