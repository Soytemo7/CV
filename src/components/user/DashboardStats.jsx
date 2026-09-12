function DashboardStats({ enrollments = [] }) {

  const total =
    enrollments.length;


  const inProgress =
    enrollments.filter(
      enrollment =>
        enrollment.status === "EN_PROGRESO"
    ).length;


  const completed =
    enrollments.filter(
      enrollment =>
        enrollment.status === "COMPLETADO"
    ).length;


  return (

    <section
      className="user-dashboard-stats"
      aria-label="Resumen académico"
    >

      <article className="user-dashboard-stat">

        <div
          className="user-dashboard-stat-icon"
          aria-hidden="true"
        >
          <i className="bi bi-book"></i>
        </div>


        <div className="user-dashboard-stat-content">

          <span>
            Cursos inscritos
          </span>

          <strong>
            {total}
          </strong>

        </div>

      </article>


      <article className="user-dashboard-stat">

        <div
          className="user-dashboard-stat-icon"
          aria-hidden="true"
        >
          <i className="bi bi-play-circle"></i>
        </div>


        <div className="user-dashboard-stat-content">

          <span>
            En progreso
          </span>

          <strong>
            {inProgress}
          </strong>

        </div>

      </article>


      <article className="user-dashboard-stat">

        <div
          className="user-dashboard-stat-icon"
          aria-hidden="true"
        >
          <i className="bi bi-check-circle"></i>
        </div>


        <div className="user-dashboard-stat-content">

          <span>
            Completados
          </span>

          <strong>
            {completed}
          </strong>

        </div>

      </article>

    </section>

  );

}


export default DashboardStats;