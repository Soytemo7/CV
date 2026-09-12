import {
  useNavigate
} from "react-router-dom";


function DashboardCourse({
  enrollment
}) {

  const navigate =
    useNavigate();


  const course =
    enrollment?.course;


  if (!course) {

    return null;

  }


  const status =
    enrollment.status ||
    "INSCRITO";


  const isCompleted =
    status === "COMPLETADO";


  const statusLabel =
    isCompleted
      ? "Completado"
      : status === "EN_PROGRESO"
        ? "En progreso"
        : "Inscrito";


  const statusClass =
    isCompleted
      ? "completed"
      : status === "EN_PROGRESO"
        ? "progress"
        : "enrolled";


  const enrolledDate =
    enrollment.enrolledAt
      ? new Date(
          enrollment.enrolledAt
        ).toLocaleDateString(
          "es-MX",
          {
            dateStyle: "medium"
          }
        )
      : null;


  const handleContinue = () => {

    navigate(
      `/dashboard/academic/courses/${course.id}`
    );

  };


  return (

    <article className="user-dashboard-course">

      <div className="user-dashboard-course-main">

        <div
          className="user-dashboard-course-icon"
          aria-hidden="true"
        >
          <i className="bi bi-mortarboard"></i>
        </div>


        <div className="user-dashboard-course-info">

          <span className="user-dashboard-course-eyebrow">
            Curso académico
          </span>


          <h3>
            {course.title}
          </h3>


          {course.description && (

            <p>
              {course.description}
            </p>

          )}


          <div className="user-dashboard-course-meta">

            <span
              className={
                `user-dashboard-status ${statusClass}`
              }
            >

              <span
                className="user-dashboard-status-dot"
              ></span>

              {statusLabel}

            </span>


            {enrolledDate && (

              <span>

                <i
                  className="bi bi-calendar3"
                  aria-hidden="true"
                ></i>

                {enrolledDate}

              </span>

            )}

          </div>

        </div>

      </div>


      {!isCompleted && (

        <div className="user-dashboard-course-action">

          <button
            type="button"
            className="user-dashboard-primary-button"
            onClick={handleContinue}
          >

            <i
              className="bi bi-arrow-right"
              aria-hidden="true"
            ></i>


            <span>
              Continuar curso
            </span>

          </button>

        </div>

      )}

    </article>

  );

}


export default DashboardCourse;