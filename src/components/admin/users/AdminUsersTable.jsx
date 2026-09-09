/* ============================================================
   ADMIN USERS TABLE
   Tabla de usuarios.
   ============================================================ */

import { useMemo, useState } from "react";


function AdminUsersTable({
  users,
  onSelectUser
}) {


  /*
  ============================================================
  ORDENAMIENTO
  ============================================================
  */

  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc"
  });


  /*
  ============================================================
  FORMATEAR FECHA
  ============================================================
  */

  const formatDate = (value) => {

    if (!value) {

      return "No disponible";

    }


    const date =
      new Date(value);


    if (Number.isNaN(date.getTime())) {

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


  /*
  ============================================================
  ROL
  ============================================================
  */

  const getRoleLabel = (role) => {

    if (role === "admin") {

      return "Administrador";

    }

    return "Usuario";

  };


  /*
  ============================================================
  ORDENAR
  ============================================================
  */

  const handleSort = (key) => {

    setSortConfig((current) => {

      if (current.key === key) {

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


  /*
  ============================================================
  ICONO DE ORDENAMIENTO
  ============================================================
  */

  const getSortIcon = (key) => {

    if (sortConfig.key !== key) {

      return "bi bi-arrow-down-up";

    }


    if (sortConfig.direction === "asc") {

      return "bi bi-arrow-up";

    }


    return "bi bi-arrow-down";

  };


  /*
  ============================================================
  ETIQUETA ARIA
  ============================================================
  */

  const getSortAriaLabel = (key, label) => {

    if (sortConfig.key !== key) {

      return `Ordenar por ${label}`;

    }


    if (sortConfig.direction === "asc") {

      return `Ordenado por ${label} ascendente. Cambiar a descendente`;

    }


    return `Ordenado por ${label} descendente. Cambiar a ascendente`;

  };


  /*
  ============================================================
  USUARIOS ORDENADOS
  ============================================================
  */

  const sortedUsers = useMemo(() => {

    const result = [...users];


    result.sort((a, b) => {

      let valueA;
      let valueB;


      switch (sortConfig.key) {

        case "name":

          valueA =
            (a.name || "")
              .trim()
              .toLocaleLowerCase("es-MX");

          valueB =
            (b.name || "")
              .trim()
              .toLocaleLowerCase("es-MX");

          break;


        case "role":

          valueA =
            a.role === "admin"
              ? "administrador"
              : "usuario";

          valueB =
            b.role === "admin"
              ? "administrador"
              : "usuario";

          break;


        case "disabled":

          valueA =
            a.disabled ? 1 : 0;

          valueB =
            b.disabled ? 1 : 0;

          break;


        case "emailVerified":

          valueA =
            a.emailVerified ? 1 : 0;

          valueB =
            b.emailVerified ? 1 : 0;

          break;


        case "createdAt":

          valueA =
            new Date(a.createdAt || 0).getTime();

          valueB =
            new Date(b.createdAt || 0).getTime();

          break;


        default:

          return 0;

      }


      if (valueA < valueB) {

        return sortConfig.direction === "asc"
          ? -1
          : 1;

      }


      if (valueA > valueB) {

        return sortConfig.direction === "asc"
          ? 1
          : -1;

      }


      return 0;

    });


    return result;

  }, [
    users,
    sortConfig
  ]);


  /*
  ============================================================
  RENDER VACÍO
  ============================================================
  */

  if (!users.length) {

    return (

      <div className="admin-users-empty">

        <div className="admin-users-empty-icon">

          <i className="bi bi-people"></i>

        </div>

        <h3>
          No hay usuarios para mostrar
        </h3>

        <p>
          No se encontraron cuentas que coincidan
          con los criterios actuales.
        </p>

      </div>

    );

  }


  /*
  ============================================================
  BOTÓN DE ENCABEZADO
  ============================================================
  */

  const SortButton = ({
    sortKey,
    label
  }) => (

    <button
      type="button"
      className="admin-users-view-button"
      onClick={() =>
        handleSort(sortKey)
      }
      aria-label={
        getSortAriaLabel(
          sortKey,
          label
        )
      }
    >

      <span>
        {label}
      </span>

      <i
        className={
          getSortIcon(sortKey)
        }
        aria-hidden="true"
      ></i>

    </button>

  );


  /*
  ============================================================
  TABLA
  ============================================================
  */

  return (

    <div className="admin-users-table-wrapper">

      <table className="admin-users-table">

        <thead>

          <tr>

            {/* ==================================================
                USUARIO
                ================================================== */}

            <th>

              <SortButton
                sortKey="name"
                label="Usuario"
              />

            </th>


            {/* ==================================================
                ROL
                ================================================== */}

            <th>

              <SortButton
                sortKey="role"
                label="Rol"
              />

            </th>


            {/* ==================================================
                ESTADO
                ================================================== */}

            <th>

              <SortButton
                sortKey="disabled"
                label="Estado"
              />

            </th>


            {/* ==================================================
                CORREO
                ================================================== */}

            <th>

              <SortButton
                sortKey="emailVerified"
                label="Correo"
              />

            </th>


            {/* ==================================================
                REGISTRO
                ================================================== */}

            <th>

              <SortButton
                sortKey="createdAt"
                label="Registro"
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


        <tbody>

          {sortedUsers.map((user) => (

            <tr key={user.uid}>


              {/* ==================================================
                  USUARIO
                  ================================================== */}

              <td>

                <div className="admin-users-user">

                  <div className="admin-users-avatar">

                    {user.photoURL ? (

                      <img
                        src={user.photoURL}
                        alt={`Foto de ${user.name || "usuario"}`}
                      />

                    ) : (

                      <span>

                        {(user.name || "U")
                          .charAt(0)
                          .toUpperCase()}

                      </span>

                    )}

                  </div>


                  <div className="admin-users-user-info">

                    <strong>
                      {user.name || "Sin nombre"}
                    </strong>

                    <small>
                      {user.email || "Sin correo"}
                    </small>

                  </div>

                </div>

              </td>


              {/* ==================================================
                  ROL
                  ================================================== */}

              <td>

                <span
                  className={
                    `admin-users-role ${
                      user.role === "admin"
                        ? "admin"
                        : "user"
                    }`
                  }
                >

                  <i
                    className={
                      user.role === "admin"
                        ? "bi bi-shield-check"
                        : "bi bi-person"
                    }
                  ></i>

                  {getRoleLabel(user.role)}

                </span>

              </td>


              {/* ==================================================
                  ESTADO
                  ================================================== */}

              <td>

                {user.disabled ? (

                  <span className="admin-users-status disabled">

                    <i className="bi bi-x-circle-fill"></i>

                    Deshabilitado

                  </span>

                ) : (

                  <span className="admin-users-status active">

                    <i className="bi bi-check-circle-fill"></i>

                    Activo

                  </span>

                )}

              </td>


              {/* ==================================================
                  CORREO
                  ================================================== */}

              <td>

                {user.emailVerified ? (

                  <span className="admin-users-verified">

                    <i className="bi bi-check-circle"></i>

                    Verificado

                  </span>

                ) : (

                  <span className="admin-users-unverified">

                    <i className="bi bi-exclamation-circle"></i>

                    Sin verificar

                  </span>

                )}

              </td>


              {/* ==================================================
                  REGISTRO
                  ================================================== */}

              <td>

                <span className="admin-users-date">

                  {formatDate(
                    user.createdAt
                  )}

                </span>

              </td>


              {/* ==================================================
                  ACCIÓN
                  ================================================== */}

              <td>

                <button
                  type="button"
                  className="admin-users-view-button"
                  onClick={() =>
                    onSelectUser(user)
                  }
                  aria-label={
                    `Ver información de ${
                      user.name || "usuario"
                    }`
                  }
                >

                  <i className="bi bi-eye"></i>

                  Ver

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}


export default AdminUsersTable;

