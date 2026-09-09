/* ============================================================
   ADMIN USERS FILTERS
   Filtros de usuarios administrativos.
   ============================================================ */

function AdminUsersFilters({

  search,
  setSearch,

  roleFilter,
  setRoleFilter,

  statusFilter,
  setStatusFilter,

  onClear

}) {

  return (

    <div className="admin-users-filters">

      {/* ======================================================
          BUSCADOR
          ====================================================== */}

      <div className="admin-users-search">

        <i className="bi bi-search"></i>

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Buscar por nombre, correo o identificador..."
          aria-label="Buscar usuarios"
        />

      </div>


      {/* ======================================================
          ROL
          ====================================================== */}

      <div className="admin-users-filter">

        <label htmlFor="admin-users-role">
          Rol
        </label>

        <select
          id="admin-users-role"
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value)
          }
        >

          <option value="all">
            Todos
          </option>

          <option value="user">
            Usuario
          </option>

          <option value="admin">
            Administrador
          </option>

        </select>

      </div>


      {/* ======================================================
          ESTADO
          ====================================================== */}

      <div className="admin-users-filter">

        <label htmlFor="admin-users-status">
          Estado
        </label>

        <select
          id="admin-users-status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >

          <option value="all">
            Todos
          </option>

          <option value="active">
            Activos
          </option>

          <option value="disabled">
            Deshabilitados
          </option>

        </select>

      </div>


      {/* ======================================================
          LIMPIAR
          ====================================================== */}

      <button
        type="button"
        className="admin-users-clear-button"
        onClick={onClear}
      >

        <i className="bi bi-arrow-counterclockwise"></i>

        Limpiar

      </button>

    </div>

  );

}


export default AdminUsersFilters;