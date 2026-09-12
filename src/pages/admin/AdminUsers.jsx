/* ============================================================
   ADMIN USERS
   Gestión de usuarios de la plataforma.
   ============================================================ */

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import AdminUsersFilters
  from "../../components/admin/users/AdminUsersFilters.jsx";

import AdminUsersTable
  from "../../components/admin/users/AdminUsersTable.jsx";

import AdminUserDetails
  from "../../components/admin/users/AdminUserDetails.jsx";

import NotificationContext
  from "../../context/NotificationContext.jsx";

import {
  getAdminUsers,
  promoteAdminUser,
  demoteAdminUser
} from "../../services/api.js";

import "../../styles/admin/admin-users.css";


function AdminUsers() {

  /*
  ============================================================
  NOTIFICACIONES
  ============================================================
  */

  const notification =
    useContext(
      NotificationContext
    );


  /*
  ============================================================
  ESTADO
  ============================================================
  */

  const [
    users,
    setUsers
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    search,
    setSearch
  ] = useState("");


  const [
    roleFilter,
    setRoleFilter
  ] = useState("all");


  const [
    statusFilter,
    setStatusFilter
  ] = useState("all");


  const [
    selectedUser,
    setSelectedUser
  ] = useState(null);


  const [
    changingRoleUser,
    setChangingRoleUser
  ] = useState(null);

  const navigate =
  useNavigate();


  /*
  ============================================================
  OBTENER USUARIOS
  ============================================================
  */

  const loadUsers =
    useCallback(async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await getAdminUsers();


        if (
          !data?.success
        ) {

          throw new Error(
            data?.error ||
            "No fue posible obtener los usuarios."
          );

        }


        setUsers(
          Array.isArray(data.users)
            ? data.users
            : []
        );

      } catch (error) {

        console.error(
          "❌ Error obteniendo usuarios:",
          error
        );


        setError(
          error?.message ||
          "No fue posible obtener los usuarios."
        );


        setUsers([]);

      } finally {

        setLoading(false);

      }

    }, []);


  /*
  ============================================================
  CARGA INICIAL
  ============================================================
  */

  useEffect(() => {

    loadUsers();

  }, [
    loadUsers
  ]);


  /*
  ============================================================
  FILTRADO
  ============================================================
  */

  const filteredUsers =
    useMemo(() => {

      const normalizedSearch =
        search
          .trim()
          .toLowerCase();


      return users.filter(
        (user) => {

          /*
          ------------------------------------------------------
          BÚSQUEDA
          ------------------------------------------------------
          */

          const matchesSearch =
            !normalizedSearch ||
            user?.name
              ?.toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            user?.email
              ?.toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            user?.uid
              ?.toLowerCase()
              .includes(
                normalizedSearch
              );


          /*
          ------------------------------------------------------
          ROL
          ------------------------------------------------------
          */

          const matchesRole =
            roleFilter === "all" ||
            user?.role === roleFilter;


          /*
          ------------------------------------------------------
          ESTADO
          ------------------------------------------------------
          */

          const matchesStatus =
            statusFilter === "all" ||
            (
              statusFilter === "active" &&
              !user?.disabled
            ) ||
            (
              statusFilter === "disabled" &&
              user?.disabled
            );


          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );

        }
      );

    }, [
      users,
      search,
      roleFilter,
      statusFilter
    ]);


  /*
  ============================================================
  RESUMEN
  ============================================================
  */

  const totalUsers =
    users.length;


  const activeUsers =
    users.filter(
      user =>
        !user?.disabled
    ).length;


  const adminUsers =
    users.filter(
      user =>
        user?.role === "admin"
    ).length;


  const verifiedUsers =
    users.filter(
      user =>
        user?.emailVerified
    ).length;


  /*
  ============================================================
  LIMPIAR FILTROS
  ============================================================
  */

  const handleClearFilters =
    () => {

      setSearch("");

      setRoleFilter("all");

      setStatusFilter("all");

    };


  /*
  ============================================================
  SELECCIONAR USUARIO
  ============================================================
  */

  const handleSelectUser =
    (user) => {

      setSelectedUser(
        user
      );

    };


  /*
  ============================================================
  CONVERTIR USUARIO EN ADMINISTRADOR
  ============================================================
  */

  const handlePromoteUser =
    async (user) => {

      if (!user?.uid) {

        return false;

      }


      /*
      ----------------------------------------------------------
      YA ES ADMINISTRADOR
      ----------------------------------------------------------
      */

      if (
        user.role === "admin"
      ) {

        return false;

      }


      /*
      ----------------------------------------------------------
      YA HAY UN CAMBIO EN PROCESO
      ----------------------------------------------------------
      */

      if (
        changingRoleUser
      ) {

        return false;

      }


      try {

        setChangingRoleUser(
          user.uid
        );


        const data =
          await promoteAdminUser(
            user.uid
          );


        /*
        --------------------------------------------------------
        VALIDAR RESPUESTA
        --------------------------------------------------------
        */

        if (
          !data?.success
        ) {

          throw new Error(
            data?.error ||
            "No fue posible convertir al usuario en administrador."
          );

        }


        /*
        ========================================================
        ACTUALIZAR TABLA
        ========================================================
        */

        setUsers(
          currentUsers =>
            currentUsers.map(
              currentUser =>
                currentUser.uid === user.uid
                  ? {
                      ...currentUser,
                      role: "admin"
                    }
                  : currentUser
            )
        );


        /*
        ========================================================
        ACTUALIZAR USUARIO SELECCIONADO
        ========================================================
        */

        setSelectedUser(
          currentUser =>
            currentUser &&
            currentUser.uid === user.uid
              ? {
                  ...currentUser,
                  role: "admin"
                }
              : currentUser
        );


        /*
        ========================================================
        NOTIFICACIÓN DE ÉXITO
        ========================================================
        */

        notification?.success({

          title:
            "Usuario convertido en administrador",

          description:
            data?.message ||
            `${user.name || user.email || "El usuario"} ahora tiene permisos administrativos.`,

          placement:
            "topRight",

          duration:
            6,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });


        return true;


      } catch (error) {

        console.error(
          "❌ Error convirtiendo usuario en administrador:",
          error
        );


        /*
        ========================================================
        NOTIFICACIÓN DE ERROR
        ========================================================
        */

        notification?.error({

          title:
            "No fue posible cambiar el rol",

          description:
            error?.message ||
            "No fue posible convertir al usuario en administrador.",

          placement:
            "topRight",

          duration:
            6,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });


        return false;

      } finally {

        setChangingRoleUser(
          null
        );

      }

    };


  /*
  ============================================================
  CONVERTIR ADMINISTRADOR EN USUARIO
  ============================================================
  */

  const handleDemoteUser =
    async (user) => {

      if (!user?.uid) {

        return false;

      }


      /*
      ----------------------------------------------------------
      NO ES ADMINISTRADOR
      ----------------------------------------------------------
      */

      if (
        user.role !== "admin"
      ) {

        return false;

      }


      /*
      ----------------------------------------------------------
      YA HAY UN CAMBIO EN PROCESO
      ----------------------------------------------------------
      */

      if (
        changingRoleUser
      ) {

        return false;

      }


      try {

        setChangingRoleUser(
          user.uid
        );


        const data =
          await demoteAdminUser(
            user.uid
          );


        /*
        --------------------------------------------------------
        VALIDAR RESPUESTA
        --------------------------------------------------------
        */

        if (
          !data?.success
        ) {

          throw new Error(
            data?.error ||
            "No fue posible convertir al administrador en usuario."
          );

        }


        /*
        ========================================================
        ACTUALIZAR TABLA
        ========================================================
        */

        setUsers(
          currentUsers =>
            currentUsers.map(
              currentUser =>
                currentUser.uid === user.uid
                  ? {
                      ...currentUser,
                      role: "user"
                    }
                  : currentUser
            )
        );


        /*
        ========================================================
        ACTUALIZAR USUARIO SELECCIONADO
        ========================================================
        */

        setSelectedUser(
          currentUser =>
            currentUser &&
            currentUser.uid === user.uid
              ? {
                  ...currentUser,
                  role: "user"
                }
              : currentUser
        );


        /*
        ========================================================
        NOTIFICACIÓN DE ÉXITO
        ========================================================
        */

        notification?.success({

          title:
            "Administrador convertido en usuario",

          description:
            data?.message ||
            `${user.name || user.email || "El usuario"} ya no tiene permisos administrativos.`,

          placement:
            "topRight",

          duration:
            6,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });


        return true;


      } catch (error) {

        console.error(
          "❌ Error convirtiendo administrador en usuario:",
          error
        );


        /*
        ========================================================
        NOTIFICACIÓN DE ERROR
        ========================================================
        */

        notification?.error({

          title:
            "No fue posible cambiar el rol",

          description:
            error?.message ||
            "No fue posible convertir al administrador en usuario.",

          placement:
            "topRight",

          duration:
            6,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });


        return false;

      } finally {

        setChangingRoleUser(
          null
        );

      }

    };


  /*
  ============================================================
  CERRAR DETALLE
  ============================================================
  */

  const handleCloseDetails =
    () => {

      if (
        changingRoleUser
      ) {

        return;

      }


      setSelectedUser(
        null
      );

    };


  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (

    <div className="private-page-container admin-users-page">

      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <header className="admin-users-header">

      <button
        type="button"
        className="admin-users-view-button"
        onClick={() =>
          navigate("/admin")
        }
      >

        <i
          className="bi bi-arrow-left"
          aria-hidden="true"
        ></i>

        Volver al panel

      </button>


      <div className="admin-users-title">

        <div
          className="
            admin-users-title-icon
            private-icon-button
            private-icon-button-blue
          "
          aria-hidden="true"
        >

          <i className="bi bi-people"></i>

        </div>


        <div>

          <h1>
            Usuarios
          </h1>

          <p>
            Consulta y supervisa las cuentas registradas
            en la plataforma.
          </p>

        </div>

      </div>

    </header>


      {/* ======================================================
          RESUMEN
          ====================================================== */}

      <section className="admin-users-summary">

        <div className="private-card admin-users-summary-card">

          <div className="admin-users-summary-icon">

            <i className="bi bi-people"></i>

          </div>

          <div className="admin-users-summary-content">

            <span>
              Usuarios
            </span>

            <strong>
              {totalUsers}
            </strong>

            <small>
              Total registrado
            </small>

          </div>

        </div>


        <div className="private-card admin-users-summary-card">

          <div className="admin-users-summary-icon">

            <i className="bi bi-person-check"></i>

          </div>

          <div className="admin-users-summary-content">

            <span>
              Activos
            </span>

            <strong>
              {activeUsers}
            </strong>

            <small>
              Cuentas activas
            </small>

          </div>

        </div>


        <div className="private-card admin-users-summary-card">

          <div className="admin-users-summary-icon">

            <i className="bi bi-shield-check"></i>

          </div>

          <div className="admin-users-summary-content">

            <span>
              Administradores
            </span>

            <strong>
              {adminUsers}
            </strong>

            <small>
              Cuentas administrativas
            </small>

          </div>

        </div>


        <div className="private-card admin-users-summary-card">

          <div className="admin-users-summary-icon">

            <i className="bi bi-envelope-check"></i>

          </div>

          <div className="admin-users-summary-content">

            <span>
              Verificados
            </span>

            <strong>
              {verifiedUsers}
            </strong>

            <small>
              Correos confirmados
            </small>

          </div>

        </div>

      </section>


      {/* ======================================================
          CONTENIDO PRINCIPAL
          ====================================================== */}

      <section className="private-card admin-users-panel">

        {/* ====================================================
            CABECERA
            ==================================================== */}

        <div className="private-card-header">

          <div className="private-card-icon">

            <i className="bi bi-person-lines-fill"></i>

          </div>

          <div>

            <h2>
              Administración de usuarios
            </h2>

            <p>
              Consulta las cuentas y su información
              de acceso.
            </p>

          </div>

        </div>


        {/* ====================================================
            ERROR DE CARGA
            ==================================================== */}

        {error && (

          <div
            className="admin-users-error"
            role="alert"
          >

            <i className="bi bi-exclamation-triangle"></i>

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={loadUsers}
            >
              Reintentar
            </button>

          </div>

        )}


        {/* ====================================================
            FILTROS
            ==================================================== */}

        <AdminUsersFilters

          search={search}

          setSearch={setSearch}

          roleFilter={roleFilter}

          setRoleFilter={setRoleFilter}

          statusFilter={statusFilter}

          setStatusFilter={setStatusFilter}

          onClear={handleClearFilters}

        />


        {/* ====================================================
            RESULTADOS
            ==================================================== */}

        <div className="admin-users-results-header">

          <span>

            {loading

              ? "Cargando usuarios..."

              : filteredUsers.length === 1

                ? "1 usuario encontrado"

                : `${filteredUsers.length} usuarios encontrados`

            }

          </span>

        </div>


        {/* ====================================================
            CARGANDO
            ==================================================== */}

        {loading ? (

          <div className="admin-users-loading">

            <i className="bi bi-arrow-repeat"></i>

            <span>
              Cargando usuarios...
            </span>

          </div>

        ) : (

          <AdminUsersTable

            users={
              filteredUsers
            }

            onSelectUser={
              handleSelectUser
            }

          />

        )}

      </section>


      {/* ======================================================
          DETALLE DEL USUARIO
          ====================================================== */}

      {selectedUser && (

        <AdminUserDetails

          user={
            selectedUser
          }

          onClose={
            handleCloseDetails
          }

          onPromote={
            handlePromoteUser
          }

          onDemote={
            handleDemoteUser
          }

          promoting={
            Boolean(
              changingRoleUser
            )
          }

        />

      )}

    </div>

  );

}


export default AdminUsers;

