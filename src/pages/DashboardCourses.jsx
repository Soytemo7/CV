import {
  useEffect,
  useMemo,
  useState
} from "react";


import DashboardCoursesHeader
  from "../components/user/DashboardCoursesHeader.jsx";


import DashboardCoursesFilters
  from "../components/user/DashboardCoursesFilters.jsx";


import DashboardCourseCard
  from "../components/user/DashboardCourseCard.jsx";


import {
  getMyEnrollments
} from "../services/user/enrollmentService.js";


import {
  getPublishedCourses,
  enrollInCourse
} from "../services/user/courseService.js";


import {
  useNotification
} from "../hooks/useNotification.js";


import "../styles/animated-border.css";
import "../styles/user/dashboard.css";
import "../styles/user/dashboardCourses.css";
import "../styles/user/dashboardCourseCard.css";


function DashboardCourses() {

  const notification =
    useNotification();


  const [
    courses,
    setCourses
  ] = useState([]);


  const [
    enrollments,
    setEnrollments
  ] = useState([]);


  const [
    search,
    setSearch
  ] = useState("");


  const [
    filter,
    setFilter
  ] = useState("TODOS");


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    enrollingCourseId,
    setEnrollingCourseId
  ] = useState(null);


  useEffect(() => {

    let cancelled = false;


    const loadCourses = async () => {

      try {

        setLoading(true);

        setError("");


        const [
          coursesResponse,
          enrollmentsResponse
        ] = await Promise.all([

          getPublishedCourses(),

          getMyEnrollments()

        ]);


        const courseData =
          Array.isArray(
            coursesResponse
          )
            ? coursesResponse
            : coursesResponse?.data ||
              [];


        const enrollmentData =
          Array.isArray(
            enrollmentsResponse
          )
            ? enrollmentsResponse
            : enrollmentsResponse?.enrollments ||
              enrollmentsResponse?.data ||
              [];


        if (!cancelled) {

          setCourses(
            courseData
          );


          setEnrollments(
            enrollmentData
          );

        }

      } catch (err) {

        console.error(
          "Error obteniendo cursos académicos:",
          err
        );


        if (!cancelled) {

          setError(
            err?.message ||
            "No fue posible obtener los cursos académicos."
          );

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    };


    loadCourses();


    return () => {

      cancelled = true;

    };

  }, []);


  const enrollmentMap =
    useMemo(() => {

      const map =
        new Map();


      enrollments.forEach(
        enrollment => {

          const courseId =
            enrollment?.course?.id ||
            enrollment?.courseId;


          if (courseId) {

            map.set(
              courseId,
              enrollment
            );

          }

        }
      );


      return map;

    }, [
      enrollments
    ]);


  const filteredCourses =
    useMemo(() => {

      const normalizedSearch =
        search
          .trim()
          .toLowerCase();


      return courses.filter(
        course => {

          const enrollment =
            enrollmentMap.get(
              course.id
            );


          const status =
            enrollment?.status ||
            null;


          const matchesSearch =
            !normalizedSearch ||
            course.title
              ?.toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            course.description
              ?.toLowerCase()
              .includes(
                normalizedSearch
              );


          if (!matchesSearch) {

            return false;

          }


          if (
            filter ===
            "DISPONIBLES"
          ) {

            return !enrollment;

          }


          if (
            filter ===
            "EN_PROGRESO"
          ) {

            return (
              status ===
              "EN_PROGRESO"
            );

          }


          if (
            filter ===
            "COMPLETADO"
          ) {

            return (
              status ===
              "COMPLETADO"
            );

          }


          return true;

        }
      );

    }, [
      courses,
      enrollmentMap,
      search,
      filter
    ]);


  const handleEnroll =
    async (
      courseId
    ) => {

      if (
        enrollingCourseId
      ) {

        return null;

      }


      try {

        setEnrollingCourseId(
          courseId
        );


        setError("");


        const response =
          await enrollInCourse(
            courseId
          );


        const newEnrollment =
          response?.enrollment ||
          response?.data?.enrollment ||
          response?.data;


        if (
          !newEnrollment
        ) {

          throw new Error(
            "No fue posible obtener la inscripción creada."
          );

        }


        const updatedEnrollment = {

          ...newEnrollment,

          courseId:
            newEnrollment.courseId ||
            courseId,

          course:
            newEnrollment.course || {

              id: courseId

            },

          status:
            newEnrollment.status ||
            "EN_PROGRESO"

        };


        setEnrollments(
          current => {

            const exists =
              current.some(
                enrollment => {

                  const enrollmentCourseId =
                    enrollment?.courseId ||
                    enrollment?.course?.id;


                  return (
                    enrollmentCourseId ===
                    courseId
                  );

                }
              );


            if (exists) {

              return current.map(
                enrollment => {

                  const enrollmentCourseId =
                    enrollment?.courseId ||
                    enrollment?.course?.id;


                  if (
                    enrollmentCourseId !==
                    courseId
                  ) {

                    return enrollment;

                  }


                  return {

                    ...enrollment,

                    ...updatedEnrollment

                  };

                }
              );

            }


            return [

              ...current,

              updatedEnrollment

            ];

          }
        );


        /* ====================================================
           NOTIFICACIÓN — INSCRIPCIÓN EXITOSA
           ==================================================== */

        notification?.success({

          title:
            "¡Inscripción exitosa!",

          description:
            "Te has inscrito correctamente al curso.",

          placement:
            "topRight",

          duration:
            8,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification",

        });


        return updatedEnrollment;

      } catch (err) {

        console.error(
          "Error inscribiendo usuario al curso:",
          err
        );


        const errorMessage =
          err?.message ||
          "No fue posible realizar la inscripción.";


        setError(
          errorMessage
        );


        /* ====================================================
           NOTIFICACIÓN — ERROR DE INSCRIPCIÓN
           ==================================================== */

        notification?.error({

          title:
            "No fue posible inscribirte",

          description:
            errorMessage,

          placement:
            "topRight",

          duration:
            8,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification",

        });


        return null;

      } finally {

        setEnrollingCourseId(
          null
        );

      }

    };


  return (

    <main className="private-page-container dashboard-courses-page">

      <DashboardCoursesHeader />


      <section className="dashboard-courses-container">

        <div className="dashboard-courses-section-card animated-border">

          <div className="dashboard-courses-card-header">

            <div className="user-dashboard-card-icon">

              <i
                className="bi bi-grid-3x3-gap"
                aria-hidden="true"
              ></i>

            </div>


            <div>

              <h2>
                Catálogo de cursos
              </h2>


              <p>
                Consulta todos los cursos académicos
                actualmente publicados.
              </p>

            </div>

          </div>


          <DashboardCoursesFilters
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />


          {loading ? (

            <div className="user-dashboard-state">

              <div className="user-dashboard-state-icon">

                <i className="bi bi-arrow-repeat"></i>

              </div>


              <div>

                <strong>
                  Cargando cursos
                </strong>


                <span>
                  Consultando el catálogo académico.
                </span>

              </div>

            </div>

          ) : error ? (

            <div className="user-dashboard-state user-dashboard-error">

              <div className="user-dashboard-state-icon user-dashboard-error-icon">

                <i className="bi bi-exclamation-triangle"></i>

              </div>


              <div>

                <strong>
                  No fue posible cargar los cursos
                </strong>


                <span>
                  {error}
                </span>

              </div>

            </div>

          ) : filteredCourses.length === 0 ? (

            <div className="user-dashboard-empty">

              <div className="user-dashboard-empty-icon">

                <i className="bi bi-search"></i>

              </div>


              <strong>
                No encontramos cursos
              </strong>


              <span>
                {search.trim()
                  ? "Prueba con otro término de búsqueda."
                  : "No existen cursos que coincidan con el filtro seleccionado."}
              </span>

            </div>

          ) : (

            <div className="dashboard-courses-grid">

              {filteredCourses.map(
                course => (

                  <DashboardCourseCard
                    key={course.id}
                    course={course}
                    enrollment={
                      enrollmentMap.get(
                        course.id
                      )
                    }
                    enrolling={
                      enrollingCourseId ===
                      course.id
                    }
                    onEnroll={
                      handleEnroll
                    }
                  />

                )
              )}

            </div>

          )}

        </div>

      </section>

    </main>

  );

}


export default DashboardCourses;