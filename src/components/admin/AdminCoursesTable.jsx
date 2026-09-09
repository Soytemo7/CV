/* ============================================================
   ADMIN COURSES TABLE
   Tabla administrativa de cursos.
   ============================================================ */

import {
  useMemo,
  useState
} from "react";


/* ============================================================
   BOTÓN DE ORDENAMIENTO
   ============================================================ */

function SortButton({
  sortKey,
  label,
  sortConfig,
  onSort
}) {

  const getSortIcon = () => {

    if (
      sortConfig.key !== sortKey
    ) {

      return "bi bi-arrow-down-up";

    }

    return sortConfig.direction === "asc"
      ? "bi bi-arrow-up"
      : "bi bi-arrow-down";

  };


  const getSortAriaLabel = () => {

    if (
      sortConfig.key !== sortKey
    ) {

      return `Ordenar por ${label}`;

    }

    if (
      sortConfig.direction === "asc"
    ) {

      return (
        `Ordenado por ${label} ascendente. ` +
        `Cambiar a descendente`
      );

    }

    return (
      `Ordenado por ${label} descendente. ` +
      `Cambiar a ascendente`
    );

  };


  return (

    <button
      type="button"
      className="admin-users-view-button"
      onClick={() =>
        onSort(sortKey)
      }
      aria-label={
        getSortAriaLabel()
      }
    >

      <span>
        {label}
      </span>

      <i
        className={
          getSortIcon()
        }
        aria-hidden="true"
      ></i>

    </button>

  );

}


/* ============================================================
   ADMIN COURSES TABLE
   ============================================================ */

function AdminCoursesTable({
  courses,
  onSelectCourse,
  onEditCourse,
  onContent,
  onChangeStatus,
  onDeleteCourse
}) {


  /* ============================================================
     ORDENAMIENTO
     ============================================================ */

  const [
    sortConfig,
    setSortConfig
  ] = useState({

    key: "createdAt",

    direction: "desc"

  });


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

        return (
          status ||
          "Sin estado"
        );

    }

  };


  /* ============================================================
     ORDENAR
     ============================================================ */

  const handleSort = (key) => {

    setSortConfig((current) => {

      if (
        current.key === key
      ) {

        return {

          key,

          direction:
            current.direction === "asc"
              ? "desc"
              : "asc"

        };

      }


      return {

        key,

        direction: "asc"

      };

    });

  };


  /* ============================================================
     CURSOS ORDENADOS
     ============================================================ */

  const sortedCourses = useMemo(() => {

    const result =
      [...courses];


    result.sort((a, b) => {

      let valueA;

      let valueB;


      switch (
        sortConfig.key
      ) {


        /* ======================================================
           TÍTULO
           ====================================================== */

        case "title":

          valueA =
            (a.title || "")
              .trim()
              .toLocaleLowerCase(
                "es-MX"
              );

          valueB =
            (b.title || "")
              .trim()
              .toLocaleLowerCase(
                "es-MX"
              );

          break;


        /* ======================================================
           ESTADO
           ====================================================== */

        case "status":

          valueA =
            (a.status || "")
              .toLocaleLowerCase(
                "es-MX"
              );

          valueB =
            (b.status || "")
              .toLocaleLowerCase(
                "es-MX"
              );

          break;


        /* ======================================================
           REGISTRO
           ====================================================== */

        case "createdAt":

          valueA =
            new Date(
              a.createdAt || 0
            ).getTime();

          valueB =
            new Date(
              b.createdAt || 0
            ).getTime();

          break;


        /* ======================================================
           ACTUALIZACIÓN
           ====================================================== */

        case "updatedAt":

          valueA =
            new Date(
              a.updatedAt || 0
            ).getTime();

          valueB =
            new Date(
              b.updatedAt || 0
            ).getTime();

          break;


        default:

          return 0;

      }


      if (
        valueA < valueB
      ) {

        return (
          sortConfig.direction === "asc"
            ? -1
            : 1
        );

      }


      if (
        valueA > valueB
      ) {

        return (
          sortConfig.direction === "asc"
            ? 1
            : -1
        );

      }


      return 0;

    });


    return result;

  }, [
    courses,
    sortConfig
  ]);


  /* ============================================================
     VACÍO
     ============================================================ */

  if (!courses.length) {

    return (

      <div className="admin-users-empty">

        <div className="admin-users-empty-icon">

          <i className="bi bi-journal-x"></i>

        </div>


        <h3>
          No hay cursos para mostrar
        </h3>


        <p>
          No existen cursos registrados
          que coincidan con los criterios
          actuales.
        </p>

      </div>

    );

  }


  /* ============================================================
     TABLA
     ============================================================ */

  return (

    <div className="admin-users-table-wrapper">

      <table className="admin-users-table">


        {/* ======================================================
           ENCABEZADO
           ====================================================== */}

        <thead>

          <tr>


            {/* ==================================================
               CURSO
               ================================================== */}

            <th>

              <SortButton
                sortKey="title"
                label="Curso"
                sortConfig={
                  sortConfig
                }
                onSort={
                  handleSort
                }
              />

            </th>


            {/* ==================================================
               ESTADO
               ================================================== */}

            <th>

              <SortButton
                sortKey="status"
                label="Estado"
                sortConfig={
                  sortConfig
                }
                onSort={
                  handleSort
                }
              />

            </th>


            {/* ==================================================
               REGISTRO
               ================================================== */}

            <th>

              <SortButton
                sortKey="createdAt"
                label="Registro"
                sortConfig={
                  sortConfig
                }
                onSort={
                  handleSort
                }
              />

            </th>


            {/* ==================================================
               ACTUALIZACIÓN
               ================================================== */}

            <th>

              <SortButton
                sortKey="updatedAt"
                label="Actualización"
                sortConfig={
                  sortConfig
                }
                onSort={
                  handleSort
                }
              />

            </th>


            {/* ==================================================
               ACCIÓN
               ================================================== */}

            <th>
              Acción
            </th>


          </tr>

        </thead>


        {/* ======================================================
           CUERPO
           ====================================================== */}

        <tbody>

          {sortedCourses.map(
            (course) => (

              <tr
                key={
                  course.id
                }
              >


                {/* ==============================================
                   CURSO
                   ============================================== */}

                <td>

                  <div className="admin-users-user">


                    <div className="admin-users-avatar">

                      <i
                        className="bi bi-journal-bookmark"
                        aria-hidden="true"
                      ></i>

                    </div>


                    <div className="admin-users-user-info">

                      <strong>
                        {
                          course.title ||
                          "Sin título"
                        }
                      </strong>


                      <small>
                        {
                          course.description ||
                          "Sin descripción"
                        }
                      </small>

                    </div>


                  </div>

                </td>


                {/* ==============================================
                   ESTADO
                   ============================================== */}

                <td>

                  {
                    course.status ===
                    "PUBLISHED"
                    ? (

                      <span className="admin-users-status active">

                        <i
                          className="bi bi-check-circle-fill"
                          aria-hidden="true"
                        ></i>

                        Publicado

                      </span>

                    )
                    : course.status ===
                      "ARCHIVED"
                    ? (

                      <span className="admin-users-status disabled">

                        <i
                          className="bi bi-archive-fill"
                          aria-hidden="true"
                        ></i>

                        Archivado

                      </span>

                    )
                    : (

                      <span className="admin-users-status">

                        <i
                          className="bi bi-pencil-square"
                          aria-hidden="true"
                        ></i>

                        {
                          getStatusLabel(
                            course.status
                          )
                        }

                      </span>

                    )
                  }

                </td>


                {/* ==============================================
                   REGISTRO
                   ============================================== */}

                <td>

                  <span className="admin-users-date">

                    {
                      formatDate(
                        course.createdAt
                      )
                    }

                  </span>

                </td>


                {/* ==============================================
                   ACTUALIZACIÓN
                   ============================================== */}

                <td>

                  <span className="admin-users-date">

                    {
                      formatDate(
                        course.updatedAt
                      )
                    }

                  </span>

                </td>


                {/* ==============================================
                   ACCIONES
                   ============================================== */}

                <td>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem"
                    }}
                  >


                    {/* ==========================================
                       VER
                       ========================================== */}

                    <button
                      type="button"
                      className="admin-users-view-button"
                      onClick={() =>
                        onSelectCourse(
                          course
                        )
                      }
                    >

                      <i
                        className="bi bi-eye"
                        aria-hidden="true"
                      ></i>

                      <span>
                        Ver
                      </span>

                    </button>


                    {/* ==========================================
                       EDITAR
                       ========================================== */}

                    <button
                      type="button"
                      className="admin-user-promote-button"
                      onClick={() =>
                        onEditCourse(
                          course
                        )
                      }
                    >

                      <i
                        className="bi bi-pencil-square"
                        aria-hidden="true"
                      ></i>

                      <span>
                        Editar
                      </span>

                    </button>


                    {/* ==========================================
                       CONTENIDO
                       ========================================== */}

                    <button
                      type="button"
                      className="admin-users-view-button"
                      onClick={() =>
                        onContent(
                          course
                        )
                      }
                      title="Administrar contenido"
                      aria-label={
                        `Administrar contenido de ${
                          course.title ||
                          "este curso"
                        }`
                      }
                    >

                      <i
                        className="bi bi-collection-play"
                        aria-hidden="true"
                      ></i>

                      <span>
                        Contenido
                      </span>

                    </button>


                    {/* ==========================================
                       PUBLICAR
                       ========================================== */}

                    {
                      course.status ===
                      "DRAFT" && (

                        <button
                          type="button"
                          className="admin-users-view-button"
                          onClick={() =>
                            onChangeStatus(
                              course,
                              "PUBLISHED"
                            )
                          }
                        >

                          <i
                            className="bi bi-cloud-arrow-up"
                            aria-hidden="true"
                          ></i>

                          <span>
                            Publicar
                          </span>

                        </button>

                      )
                    }


                    {/* ==========================================
                       ARCHIVAR
                       ========================================== */}

                    {
                      course.status ===
                      "PUBLISHED" && (

                        <button
                          type="button"
                          className="admin-users-view-button"
                          onClick={() =>
                            onChangeStatus(
                              course,
                              "ARCHIVED"
                            )
                          }
                        >

                          <i
                            className="bi bi-archive"
                            aria-hidden="true"
                          ></i>

                          <span>
                            Archivar
                          </span>

                        </button>

                      )
                    }


                    {/* ==========================================
                       ELIMINAR
                       ========================================== */}

                    <button
                      type="button"
                      className="admin-promotion-cancel-button"
                      onClick={() =>
                        onDeleteCourse(
                          course
                        )
                      }
                    >

                      <i
                        className="bi bi-trash"
                        aria-hidden="true"
                      ></i>

                      <span>
                        Eliminar
                      </span>

                    </button>


                  </div>

                </td>


              </tr>

            )
          )}

        </tbody>


      </table>

    </div>

  );

}


export default AdminCoursesTable;

