import DashboardAcademicCourseLesson
  from "./DashboardAcademicCourseLesson.jsx";
  import "../../styles/user/dashboardAcademicCourse.css";


function DashboardAcademicCourseModule({
  module,
  moduleIndex,
  unlocked,
  completed,
  progressMap,
  onOpenLesson
}) {

  const lessons =
    Array.isArray(module?.lessons)
      ? [...module.lessons].sort(
          (a, b) =>
            Number(a.order || 0) -
            Number(b.order || 0)
        )
      : [];


  const moduleVideoIds =
    lessons.flatMap(
      lesson =>
        Array.isArray(lesson?.videos)
          ? lesson.videos.map(
              video => video.id
            )
          : []
    );


  const completedVideos =
    moduleVideoIds.filter(
      videoId =>
        progressMap.get(videoId) === true
    ).length;


  const totalVideos =
    moduleVideoIds.length;


  const progress =
    totalVideos > 0
      ? Math.round(
          (completedVideos /
            totalVideos) *
            100
        )
      : 0;


  return (
    <article
      className={`
        academic-course-module
        ${unlocked
          ? ""
          : "academic-course-module-locked"}
        ${completed
          ? "academic-course-module-completed"
          : ""}
        animated-border
      `}
    >

      {/* =====================================================
          ENCABEZADO DEL MÓDULO
          ===================================================== */}

      <header className="academic-course-module-header">

        <div
          className={`
            private-icon-button
            ${
              unlocked
                ? "private-icon-button-blue"
                : "private-icon-button-red"
            }
          `}
          aria-hidden="true"
        >

          <i
            className={
              unlocked
                ? "bi bi-journal-bookmark"
                : "bi bi-lock"
            }
          />

        </div>


        <div className="academic-course-module-info">

          <span className="private-page-eyebrow">
            Módulo {moduleIndex + 1}
          </span>


          <h2>
            {module.title ||
              `Módulo ${moduleIndex + 1}`}
          </h2>


          {module.description && (
            <p>
              {module.description}
            </p>
          )}

        </div>


        <div
          className={`
            academic-course-module-status
            ${
              completed
                ? "completed"
                : unlocked
                  ? "available"
                  : "locked"
            }
          `}
        >

          {completed ? (
            <>
              <i
                className="bi bi-check-circle-fill"
                aria-hidden="true"
              />

              <span>
                Completado
              </span>
            </>
          ) : unlocked ? (
            <>
              <i
                className="bi bi-unlock-fill"
                aria-hidden="true"
              />

              <span>
                Disponible
              </span>
            </>
          ) : (
            <>
              <i
                className="bi bi-lock-fill"
                aria-hidden="true"
              />

              <span>
                Bloqueado
              </span>
            </>
          )}

        </div>

      </header>


      {/* =====================================================
          PROGRESO DEL MÓDULO
          ===================================================== */}

      <div className="academic-course-module-progress">

        <div className="academic-course-module-progress-header">

          <span>
            Progreso del módulo
          </span>


          <strong>
            {progress}%
          </strong>

        </div>


        <div className="academic-course-module-progress-bar">

          <span
            style={{
              width: `${progress}%`
            }}
          />

        </div>


        <small>
          {completedVideos} de{" "}
          {totalVideos} videos completados
        </small>

      </div>


      {/* =====================================================
          LECCIONES
          ===================================================== */}

      <div className="academic-course-module-lessons">

        {lessons.length === 0 ? (

          <div className="academic-state-card">

            <div className="academic-empty">

              <div className="academic-empty-icon">

                <i
                  className="bi bi-info-circle"
                  aria-hidden="true"
                />

              </div>


              <strong>
                Módulo sin lecciones
              </strong>


              <span>
                Este módulo todavía no tiene
                contenido académico disponible.
              </span>

            </div>

          </div>

        ) : (

          lessons.map(
            (
              lesson,
              lessonIndex
            ) => (

              <DashboardAcademicCourseLesson
                key={lesson.id}
                lesson={lesson}
                lessonIndex={lessonIndex}
                unlocked={unlocked}
                progressMap={progressMap}
                onOpenLesson={onOpenLesson}
              />

            )
          )

        )}

      </div>

    </article>
  );
}


export default DashboardAcademicCourseModule;