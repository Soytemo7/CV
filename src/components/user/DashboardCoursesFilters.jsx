function DashboardCoursesFilters({
  search,
  setSearch,
  filter,
  setFilter
}) {

  return (

    <section className="dashboard-courses-filters">

      <div className="dashboard-courses-search">

        <i
          className="bi bi-search"
          aria-hidden="true"
        ></i>


        <input
          type="search"
          value={search}
          onChange={
            event =>
              setSearch(
                event.target.value
              )
          }
          placeholder="Buscar curso..."
          aria-label="Buscar curso"
        />

      </div>


      <div
        className="dashboard-courses-filter-buttons"
        role="group"
        aria-label="Filtrar cursos"
      >

        <button
          type="button"
          className={
            filter === "TODOS"
              ? "active"
              : ""
          }
          onClick={() => setFilter("TODOS")}
        >
          Todos
        </button>


        <button
          type="button"
          className={
            filter === "DISPONIBLES"
              ? "active"
              : ""
          }
          onClick={
            () =>
              setFilter("DISPONIBLES")
          }
        >
          Disponibles
        </button>


        <button
          type="button"
          className={
            filter === "EN_PROGRESO"
              ? "active"
              : ""
          }
          onClick={
            () =>
              setFilter("EN_PROGRESO")
          }
        >
          En progreso
        </button>


        <button
          type="button"
          className={
            filter === "COMPLETADO"
              ? "active"
              : ""
          }
          onClick={
            () =>
              setFilter("COMPLETADO")
          }
        >
          Completados
        </button>

      </div>

    </section>

  );

}


export default DashboardCoursesFilters;