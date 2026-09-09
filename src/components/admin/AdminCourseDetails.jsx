/* ============================================================
   ADMIN COURSE DETAILS
   Panel lateral de información del curso.
   ============================================================ */


function AdminCourseDetails({
  course,
  onClose,
  onEdit
}) {

  if (!course) {
    return null;
  }


  /* ============================================================
     FECHA
     ============================================================ */

  const formatDate = (value) => {

    if (!value) {
      return "No disponible";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "No disponible";
    }

    return date.toLocaleDateString(
      "es-MX",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );

  };


  /* ============================================================
     ESTADO
     ============================================================ */

  const getStatusLabel = (status) => {

    switch (status) {

      case "PUBLISHED":
        return "Publicado";

      case "DRAFT":
        return "Borrador";

      case "ARCHIVED":
        return "Archivado";

      default:
        return status || "Sin estado";

    }

  };


  /* ============================================================
     RENDER
     ============================================================ */

  return (

    <>

      <div
        className="admin-user-details-overlay"
        onClick={onClose}
      ></div>


      <aside className="admin-user-details">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="admin-user-details-header">

          <div>

            <span>
              Curso
            </span>

            <h2>
              Información
            </h2>

          </div>


          <button
            type="button"
            className="admin-user-details-close"
            onClick={onClose}
            aria-label="Cerrar información del curso"
          >

            <i className="bi bi-x-lg"></i>

          </button>

        </div>


        {/* ==================================================
            PERFIL
            ================================================== */}

        <div className="admin-user-details-profile">

          <div className="admin-user-details-avatar">

            <i className="bi bi-journal-bookmark"></i>

          </div>


          <h3>
            {course.title || "Sin título"}
          </h3>


          <p>
            {getStatusLabel(course.status)}
          </p>

        </div>


        {/* ==================================================
            INFORMACIÓN
            ================================================== */}

        <div className="admin-user-details-info">

          <div className="admin-user-details-item">

            <span>
              Título
            </span>

            <strong>
              {course.title || "No disponible"}
            </strong>

          </div>


          <div className="admin-user-details-item">

            <span>
              Descripción
            </span>

            <strong>
              {course.description ||
                "Sin descripción"}
            </strong>

          </div>


          <div className="admin-user-details-item">

            <span>
              Estado
            </span>

            <strong
              className={
                course.status === "PUBLISHED"
                  ? "success"
                  : undefined
              }
            >
              {getStatusLabel(course.status)}
            </strong>

          </div>


          <div className="admin-user-details-item">

            <span>
              Fecha de creación
            </span>

            <strong>
              {formatDate(course.createdAt)}
            </strong>

          </div>


          <div className="admin-user-details-item">

            <span>
              Última actualización
            </span>

            <strong>
              {formatDate(course.updatedAt)}
            </strong>

          </div>


          <div className="admin-user-details-item">

            <span>
              ID del curso
            </span>

            <strong className="admin-user-details-uid">
              {course.id || "No disponible"}
            </strong>

          </div>

        </div>


        {/* ==================================================
            ACCIÓN
            ================================================== */}

        <div
          style={{
            marginTop: "1.5rem"
          }}
        >

          <button
            type="button"
            className="admin-user-promote-button"
            onClick={() => onEdit(course)}
          >

            <i className="bi bi-pencil-square"></i>

            <span className="admin-user-promote-button-content">

              <strong>
                Editar curso
              </strong>

              <small>
                Modificar información
              </small>

            </span>

          </button>

        </div>


        {/* ==================================================
            FOOTER
            ================================================== */}

        <div className="admin-user-details-footer">

          Identificador:
          {" "}
          {course.id || "No disponible"}

        </div>

      </aside>

    </>

  );

}


export default AdminCourseDetails;