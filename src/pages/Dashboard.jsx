import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  AuthContext
} from "../context/AuthContext.jsx";

import DashboardWelcome
  from "../components/user/DashboardWelcome.jsx";

import DashboardStats
  from "../components/user/DashboardStats.jsx";

import DashboardCourse
  from "../components/user/DashboardCourse.jsx";

import {
  getMyEnrollments
} from "../services/user/enrollmentService.js";

import DashboardPublishedCourses
  from "../components/user/DashboardPublishedCourses.jsx";

import {
  getPublishedCourses
} from "../services/admin/courseService.js";


import "../styles/user/dashboard.css";
import "../styles/animated-border.css";


function Dashboard() {

  const {
    user
  } = useContext(AuthContext);


  const [
    enrollments,
    setEnrollments
  ] = useState([]);


  const [
    publishedCourses,
    setPublishedCourses
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    let cancelled = false;


    const loadDashboard = async () => {

      try {

        setLoading(true);

        setError("");


        const [
          enrollmentsResponse,
          coursesResponse
        ] = await Promise.all([

          getMyEnrollments(),

          getPublishedCourses()

        ]);


        const enrollmentData =
          Array.isArray(enrollmentsResponse)
            ? enrollmentsResponse
            : enrollmentsResponse?.enrollments ||
              enrollmentsResponse?.data ||
              [];


        const courseData =
          Array.isArray(coursesResponse)
            ? coursesResponse
            : coursesResponse?.data ||
              [];


        if (!cancelled) {

          setEnrollments(
            enrollmentData
          );


          setPublishedCourses(
            courseData.slice(0, 4)
          );

        }

      } catch (err) {

        console.error(
          "Error obteniendo información académica:",
          err
        );


        if (!cancelled) {

          setError(
            err?.message ||
            "No fue posible obtener tu información académica."
          );

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    };


    loadDashboard();


    return () => {

      cancelled = true;

    };

  }, []);


  /*
   * CURSO PARA CONTINUAR APRENDIENDO
   *
   * Solamente se muestra un curso
   * que se encuentre EN_PROGRESO.
   *
   * Los cursos COMPLETADOS no aparecen
   * en esta sección.
   */
  const currentEnrollment =
    enrollments.find(
      enrollment =>
        enrollment.status === "EN_PROGRESO"
    ) || null;


  return (

    <main className="private-page-container user-dashboard-page">

      <DashboardWelcome
        user={user}
      />


      {loading ? (

        <section className="user-dashboard-state">

          <div
            className="user-dashboard-state-icon"
            aria-hidden="true"
          >
            <i className="bi bi-arrow-repeat"></i>
          </div>


          <div>

            <strong>
              Cargando información académica
            </strong>

            <span>
              Consultando tus inscripciones.
            </span>

          </div>

        </section>

      ) : error ? (

        <section className="user-dashboard-state user-dashboard-error">

          <div
            className="user-dashboard-state-icon user-dashboard-error-icon"
            aria-hidden="true"
          >
            <i className="bi bi-exclamation-triangle"></i>
          </div>


          <div>

            <strong>
              No fue posible cargar tus cursos
            </strong>

            <span>
              {error}
            </span>

          </div>

        </section>

      ) : (

        <>

          <DashboardStats
            enrollments={enrollments}
          />


          <DashboardPublishedCourses
            courses={publishedCourses}
          />


          <section className="user-dashboard-section">

            <div className="user-dashboard-section-card animated-border">

              <div className="user-dashboard-card-header">

                <div
                  className="user-dashboard-card-icon"
                  aria-hidden="true"
                >
                  <i className="bi bi-play-circle"></i>
                </div>


                <div>

                  <h2>
                    Continuar aprendiendo
                  </h2>

                  <p>
                    Retoma tu formación académica.
                  </p>

                </div>

              </div>


              {currentEnrollment ? (

                <DashboardCourse
                  enrollment={
                    currentEnrollment
                  }
                />

              ) : (

                <div className="user-dashboard-empty">

                  <div
                    className="user-dashboard-empty-icon"
                    aria-hidden="true"
                  >
                    <i className="bi bi-book"></i>
                  </div>


                  <strong>
                    No tienes cursos en progreso
                  </strong>


                  <span>
                    Cuando tengas un curso en progreso,
                    aparecerá aquí.
                  </span>

                </div>

              )}

            </div>

          </section>


          {enrollments.length > 0 && (

            <section className="user-dashboard-section">

              <div className="user-dashboard-section-card animated-border">

                <div className="user-dashboard-card-header">

                  <div
                    className="user-dashboard-card-icon"
                    aria-hidden="true"
                  >
                    <i className="bi bi-collection"></i>
                  </div>


                  <div>

                    <h2>
                      Mis cursos
                    </h2>

                    <p>
                      Cursos en los que estás inscrito.
                    </p>

                  </div>

                </div>


                <div className="user-dashboard-courses">

                  {enrollments.map(
                    enrollment => (

                      <DashboardCourse
                        key={
                          enrollment.id
                        }
                        enrollment={
                          enrollment
                        }
                      />

                    )
                  )}

                </div>

              </div>

            </section>

          )}

        </>

      )}

    </main>

  );

}


export default Dashboard;