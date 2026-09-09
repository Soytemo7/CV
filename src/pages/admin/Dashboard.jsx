import {
  Link,
} from "react-router-dom";


function Dashboard() {

  return (

    <div className="private-page-container admin-dashboard">

      {/* ========================================================
          ENCABEZADO
          ======================================================== */}

      <header className="private-page-header">

        <span className="private-page-eyebrow">
          Administración
        </span>


        <h1>
          Dashboard
        </h1>


        <p>
          Gestiona desde un solo lugar los usuarios,
          cursos, inscripciones, evaluaciones y certificados
          de la plataforma académica.
        </p>

      </header>


      {/* ========================================================
          RESUMEN
          ======================================================== */}

      <section className="admin-dashboard-grid">

        {/* ======================================================
            USUARIOS
            ====================================================== */}

        <Link
          to="/admin/users"
          className="private-card admin-dashboard-card"
        >

          <div className="private-card-header">

            <div className="private-card-icon">

              <i className="bi bi-people"></i>

            </div>


            <div>

              <h2>
                Usuarios
              </h2>

              <p>
                Administración de usuarios
              </p>

            </div>

          </div>


          <div className="admin-dashboard-card-footer">

            <span>
              Gestionar usuarios
            </span>

            <i className="bi bi-arrow-right"></i>

          </div>

        </Link>


        {/* ======================================================
            CURSOS
            ====================================================== */}

        <Link
          to="/admin/courses"
          className="private-card admin-dashboard-card"
        >

          <div className="private-card-header">

            <div className="private-card-icon">

              <i className="bi bi-mortarboard"></i>

            </div>


            <div>

              <h2>
                Cursos
              </h2>

              <p>
                Gestión académica
              </p>

            </div>

          </div>


          <div className="admin-dashboard-card-footer">

            <span>
              Gestionar cursos
            </span>

            <i className="bi bi-arrow-right"></i>

          </div>

        </Link>


        {/* ======================================================
            INSCRIPCIONES
            ====================================================== */}

        <Link
          to="/admin/enrollments"
          className="private-card admin-dashboard-card"
        >

          <div className="private-card-header">

            <div className="private-card-icon">

              <i className="bi bi-person-check"></i>

            </div>


            <div>

              <h2>
                Inscripciones
              </h2>

              <p>
                Seguimiento de alumnos
              </p>

            </div>

          </div>


          <div className="admin-dashboard-card-footer">

            <span>
              Ver inscripciones
            </span>

            <i className="bi bi-arrow-right"></i>

          </div>

        </Link>


        {/* ======================================================
            EVALUACIONES
            ====================================================== */}

        <Link
          to="/admin/assessments"
          className="private-card admin-dashboard-card"
        >

          <div className="private-card-header">

            <div className="private-card-icon">

              <i className="bi bi-clipboard-check"></i>

            </div>


            <div>

              <h2>
                Evaluaciones
              </h2>

              <p>
                Exámenes y resultados
              </p>

            </div>

          </div>


          <div className="admin-dashboard-card-footer">

            <span>
              Gestionar evaluaciones
            </span>

            <i className="bi bi-arrow-right"></i>

          </div>

        </Link>


        {/* ======================================================
            CERTIFICADOS
            ====================================================== */}

        <Link
          to="/admin/certificates"
          className="private-card admin-dashboard-card"
        >

          <div className="private-card-header">

            <div className="private-card-icon">

              <i className="bi bi-patch-check"></i>

            </div>


            <div>

              <h2>
                Certificados
              </h2>

              <p>
                Certificación académica
              </p>

            </div>

          </div>


          <div className="admin-dashboard-card-footer">

            <span>
              Gestionar certificados
            </span>

            <i className="bi bi-arrow-right"></i>

          </div>

        </Link>

      </section>


      {/* ========================================================
          INFORMACIÓN
          ======================================================== */}

      <section className="private-card admin-dashboard-info">

        <div className="private-card-header">

          <div className="private-card-icon">

            <i className="bi bi-shield-check"></i>

          </div>


          <div>

            <h2>
              Panel administrativo
            </h2>

            <p>
              Control de la plataforma académica
            </p>

          </div>

        </div>


        <div className="admin-dashboard-info-content">

          <p>
            Desde este panel podrás administrar la estructura
            académica y supervisar el ciclo completo del alumno:
            inscripción, contenido, progreso, evaluación y
            certificación.
          </p>

        </div>

      </section>

    </div>

  );

}


export default Dashboard;