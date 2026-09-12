import { Link } from "react-router-dom";

import "../../styles/animated-border.css";
import "../../styles/user/dashboardPublishedCourses.css";


function DashboardPublishedCourses({
  courses = []
}) {

  if (!courses.length) {
    return null;
  }


  return (

    <section className="user-dashboard-section">

      <div className="user-dashboard-section-card">

        <div className="user-dashboard-card-header">

          <div
            className="user-dashboard-card-icon"
            aria-hidden="true"
          >
            <i className="bi bi-mortarboard"></i>
          </div>


          <div>

            <h2>
              Últimos 4 cursos publicados
            </h2>

            <p>
              Cursos académicos publicados recientemente.
            </p>

          </div>

        </div>


        <div className="user-dashboard-published-courses">

          <div className="user-dashboard-published-grid">

            {courses.map(
              course => (

                <article
                  key={course.id}
                  className="user-dashboard-published-card animated-border"
                >

                  <div
                    className="user-dashboard-card-icon"
                    aria-hidden="true"
                  >
                    <i className="bi bi-book"></i>
                  </div>


                  <div className="user-dashboard-published-content">

                    <h3 className="user-dashboard-published-title">
                      {course.title}
                    </h3>


                    <p className="user-dashboard-published-description">
                      {course.description ||
                        "Curso académico disponible."}
                    </p>

                  </div>


                  <div className="user-dashboard-published-footer">

                    <span className="user-dashboard-published-status">

                      <i className="bi bi-check-circle"></i>

                      Publicado

                    </span>

                  </div>

                </article>

              )
            )}

          </div>


          <div
            className="user-dashboard-course-action"
            style={{
                marginTop: "24px"
            }}
            >

            <Link
              to="/dashboard/courses"
              className="user-dashboard-primary-button"
            >

              <i className="bi bi-grid-3x3-gap"></i>

              <span>
                Ver todos los cursos
              </span>

              <i className="bi bi-arrow-right"></i>

            </Link>

          </div>

        </div>

      </div>

    </section>

  );

}


export default DashboardPublishedCourses;